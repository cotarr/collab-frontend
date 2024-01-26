// -----------------------------------------------------------------------------
//
//           ExpressJs Web Server
//
// -----------------------------------------------------------------------------

'use strict';

// native node packages
const http = require('http');
const path = require('path');
const fs = require('fs');

// express packages
const express = require('express');
const session = require('express-session');
const logger = require('morgan');
const logConfig = require('./utils/log-config');
const helmet = require('helmet');
const csrf = require('@dr.pogodin/csurf');
const csrfProtection = csrf({ cookie: false });
const compression = require('compression');
const app = express();
const passport = require('passport');
const rateLimit = require('express-rate-limit');
const logout = require('./auth/logout');
const unAuthRoute = require('./auth/unauth-route');

// Custom Modules
const checkVhost = require('./middlewares/check-vhost');
const robotPolicy = require('./utils/robot-policy');
const securityContact = require('./utils/security-contact');
const auth = require('./auth/auth-check');

// Route Handlers
const apiProxy = require('./routes/api-proxy');
const userinfo = require('./routes/introspect').user;
const introspect = require('./routes/introspect').introspect;

const config = require('./config');
const nodeEnv = process.env.NODE_ENV || 'development';

if (nodeEnv === 'production') {
  if (config.session.secret === 'Change Me') {
    console.error('Error, session secret must be changed for production');
    process.exit(1);
  }
  if (config.oauth2.clientSecret === 'ssh-secret') {
    console.error('Error, oauth2 client secret must be changed for production');
    process.exit(1);
  }
}

if (nodeEnv === 'production') {
  app.use(compression());
}

// HTTP access log
app.use(logger(logConfig.format, logConfig.options));

// ------------------------------
// Content Security Policy (CSP)
// ------------------------------
// -- Helmet CSP defaults v7.0.0 --
// default-src 'self';
// base-uri 'self';
// font-src 'self' https: data:;
// form-action 'self';
// frame-ancestors 'self';
// img-src 'self' data:;
// object-src 'none';
// script-src 'self';
// script-src-attr 'none';
// style-src 'self' https: 'unsafe-inline';
// upgrade-insecure-requests
// ------------------------------
const contentSecurityPolicy = {
  // Option to disable defaults
  useDefaults: false,
  // Custom CSP
  directives: {
    defaultSrc: ["'none'"],
    baseUri: ["'self'"],
    connectSrc: ["'self'"],
    imgSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'"],
    formAction: ["'self'"],
    frameAncestors: ["'none'"]
  },
  // Option to disable CSP while showing errors in console log.
  reportOnly: false
};

// ----------------------------------------
// HTTP Security Headers
// ----------------------------------------
// -- Helmet Default headers v7.0.0 --
// Cross-Origin-Opener-Policy: same-origin
// Cross-Origin-Resource-Policy: same-origin
// Origin-Agent-Cluster: ?1
// Referrer-Policy: no-referrer
// Strict-Transport-Security: max-age=15552000; includeSubDomains
// X-Content-Type-Options: nosniff
// X-DNS-Prefetch-Control: off
// X-Download-Options: noopen
// X-Frame-Options: SAMEORIGIN
// X-Permitted-Cross-Domain-Policies: none
// X-XSS-Protection: 0
// X-Powered-By: ( Removed by helmet)
// ----------------------------------------
app.use(helmet({
  xFrameOptions: { action: 'deny' },
  xPoweredBy: false,
  referrerPolicy: { policy: 'no-referrer' },
  contentSecurityPolicy: contentSecurityPolicy
}));

// Route: /status    Is the server alive?
app.get('/status', (req, res) => res.json({ status: 'ok' }));

/**
 * Middleware IP rate limiter for token API routes
 */
const webRateLimit = rateLimit({
  windowMs: config.limits.webRateLimitTimeMs,
  max: config.limits.webRateLimitCount,
  statusCode: 429,
  message: 'Too many requests',
  standardHeaders: false,
  legacyHeaders: false
});
app.use(webRateLimit);

// Route for security.txt
app.get('/.well-known/security.txt', securityContact);

// Route for robot policy
app.get('/robots.txt', robotPolicy);

// From this point, reject all requests not matching vhost domain name
app.use(checkVhost.rejectNotVhost);

// -----------------------------------------------------------------
// express-session
// -----------------------------------------------------------------

const sessionOptions = {
  name: 'collab-frontend.sid',
  proxy: false,
  rolling: config.session.rollingCookie,
  resave: false,
  saveUninitialized: false,
  secret: config.session.secret,
  cookie: {
    path: '/',
    maxAge: config.session.maxAge,
    secure: config.server.tls,
    httpOnly: true,
    sameSite: 'Lax'
  }
};

const sessionStore = {};
if (config.session.enableRedis) {
  // redis database queries
  // list:       KEYS *
  // view:       GET <key>
  // Clear all:  FLUSHALL
  console.log('Using redis for session storage');
  sessionStore.redis = require('redis');
  sessionStore.RedisStore = require('connect-redis').default;
  const redisClientOptions = {};
  // must match /etc/redis/redis.conf "requirepass <password>"
  if ((config.session.redisPassword) && (config.session.redisPassword.length > 0)) {
    redisClientOptions.password = config.session.redisPassword;
  }
  sessionStore.redisClient = sessionStore.redis.createClient(redisClientOptions);
  sessionStore.redisClient.connect()
    .catch((err) => {
      console.log('redis-server error: ', err.toString());
      // fatal error
      process.exit(1);
    });
  const redisStoreOptions = {
    client: sessionStore.redisClient,
    prefix: config.session.redisPrefix,
    ttl: config.session.ttl,
    disableTouch: (config.session.rollingCookie === false)
    // redis uses Cookie ttl for session expire, unless session cookie, (see next)
  };
  sessionOptions.store = new sessionStore.RedisStore(redisStoreOptions);
} else {
  console.log('Using memorystore for session storage');
  sessionStore.MemoryStore = require('memorystore')(session);
  sessionOptions.store = new sessionStore.MemoryStore({
    // memorystore in milliseconds
    ttl: config.session.maxAge,
    stale: false,
    // Memorystore takes prune time in milliseconds
    checkPeriod: config.session.pruneInterval * 1000
  });
}
app.use(session(sessionOptions));

// -----------------------
//     Passport OAuth2
// -----------------------
app.use(passport.initialize());
app.use(passport.session());
require('./auth/passport-config');

// Edge case, IOS iPhone browser request
// favicon.ico without cookie, causing
// new authorization workflow to start
app.get('/favicon.ico', function (req, res, next) {
  res.status(204).send(null);
});

// -----------------------------
// Unauthorized Landing Page
// -----------------------------
app.get('/unauthorized', unAuthRoute.unAuthHtml);
app.get('/unauthorized.css', unAuthRoute.unAuthStyles);

// -------------------------
// Authorization Routes
// -------------------------
app.get('/login', passport.authenticate('oauth2'));
//
// Authorization callback route
// Return /login/callback to exchange authorization code for access token.
// See below for /redirect.html
// An auth server redirect back with "/login/callback?error=access_denied"
// will issue standard 401 Unauthorized unless failureRedirect URL is defined.
//
app.get('/login/callback',
  passport.authenticate('oauth2',
    {
      keepSessionInfo: true
    }
  ),
  (req, res) => {
    res.redirect('/');
  }
);

// -----------------------------------------------------
// User logout routes
// -----------------------------------------------------
app.get('/logout', logout.logout);
app.get('/logout.css', logout.logoutServeCss);

// ---------------------------------------------------------
// Redirect user to authorization server to change password
// ---------------------------------------------------------
app.get('/changepassword',
  auth.check(),
  (req, res) => { res.redirect(config.oauth2.authURL + '/changepassword'); }
);

// --------------------
//     API routes
// --------------------
app.get('/userinfo',
  auth.check(),
  userinfo
);

// ----------------------------------------------------------------------
// Relay this from auth server back to user browser as auth demonstration
// This info is not intended for use by end user.
// ----------------------------------------------------------------------
app.get('/proxy/oauth/introspect',
  auth.check(),
  introspect
);

// -----------------------------------------------------
// Mock REST API
//
// The request is expected to have a valid user cookie.
// The auth.check() middleware is used to reject
// requests that do not have a valid cookie.
//
// The request uses csurf middleware to reject
// requests not having proper csrf token (403 Forbidden).
// Methods GET and HEAD are excluded from the check.
//
// All requests to /api are handled using express-proxy
// in the apiProxy route handler. Oauth 2.0 access_tokens
// are added by the apiProxy middleware.
// -----------------------------------------------------
app.use('/api',
  auth.check(),
  csrfProtection,
  apiProxy
);

// -----------------------------------------------------
// Body Parser
//
// Issue: The apiProxy route here uses express-http-proxy.
//        Express-http-proxy docs require body-parser to be
//        defined after express-http-proxy is defined.
//        Csurf middleware requires body-parser to be
//        defined before csurf to decode the urlencoded form request.
//        It is unclear how to resolve this...
//
//        From experiment:
//        If form submission is not required, both body parser types
//        can be omitted, and backend will parses it's own JSON data.
//        To handle form data, parsing urlencoded data without JSON
//        seems to break the reverse proxy for the JSON case.
//        Therefore to demonstrate form data both json and urlencoded
//        body parser types are included. (TODO look into this)
//
//        The body parser is not needed when using the fetch API
//        in the browser, because csrf tokens can be sent as an
//        html header.
// -----------------------------------------------------
// Decode JSON data from body
app.use(express.json());
// Decode x-www-form-urlencoded data from body.
app.use(express.urlencoded({ extended: false }));

// -----------------------
// Authenticated status
// -----------------------
app.get('/secure',
  auth.check(),
  (req, res) => res.json({ secure: 'ok' })
);

// ----------------------------------------------------
// This is a simple middleware function to
// substitute the {{csrf-token}} string for a random
// generated CSRF token.
//
// The npm module csurf is used to reduce the risk of
// cross-origin submissions using the user's cookie.
// Csurf middleware will insert a req.csrfToken() function
// into the req object to generate new tokens.
// ----------------------------------------------------
const insertCsrfTokenToHtmlPage = function (pageFilename) {
  return [
    csrfProtection,
    function (req, res, next) {
      return fs.readFile(secureDir + pageFilename, 'utf8', function (err, data) {
        if (err) {
          return res.status(404).send('Not Found');
        } else {
          // Render suggestions page
          // Generate and substitute csrfToken (2 places)
          return res.send(data.replace('{{csrfToken}}', req.csrfToken())
          );
        }
      });
    }
  ];
};
// ------------------------------------------------
// Pages to be rendered with CSRF token inserted.
// ------------------------------------------------
app.get('/',
  auth.check({ redirectURL: '/unauthorized' }),
  insertCsrfTokenToHtmlPage('/index.html'));

app.get('/index.html',
  auth.check({ redirectURL: '/unauthorized' }),
  insertCsrfTokenToHtmlPage('/index.html'));

// -------------------------------
// Web server for static files
// All static files require authorization
// using a valid cookie.
// -------------------------------

// File path to static web site
const secureDir = path.join(__dirname, '../secure');

console.log('Serving files from: ' + secureDir);
app.use(
  auth.check(),
  // auth.check({ redirectURL: '/unauthorized' }),
  express.static(secureDir)
);

// ---------------------------------
//       T E S T   E R R O R
// ---------------------------------
// app.get('/error', (req, res, next) => { throw new Error('Test error'); });

// ---------------------------------
//    E R R O R   H A N D L E R S
// ---------------------------------
//
// catch 404 Not Found
//
app.use(function (req, res, next) {
  const err = new Error(http.STATUS_CODES[404]);
  err.status = 404;
  return res.set('Content-Type', 'text/plain').status(err.status).send(err.message);
});
//
// Custom error handler
//
app.use(function (err, req, res, next) {
  // per Node docs, if response in progress, must be returned to default error handler
  if (res.headersSent) return next(err);
  const status = err.status || 500;
  let message = http.STATUS_CODES[status] || 'Unknown Error Occurred';
  if ((err.message) && (message !== err.message)) message += ', ' + err.message;
  message = 'Status: ' + status.toString() + ', ' + message;

  // Custom error response for csurf middleware
  if (err.code === 'EBADCSRFTOKEN') {
    console.log('Invalid csrf token');
    return res.status(403).send('Forbidden, invalid csrf token');
  }

  if (nodeEnv === 'production') {
    console.log(message);
    return res.set('Content-Type', 'text/plain').status(status).send(message);
  } else {
    console.log(err);
    return res.set('Content-Type', 'text/plain').status(status).send(message + '\n' + err.stack);
  }
});

module.exports = app;
