// -----------------------------------------------------------------------------
//
//           ExpressJs Web Server
//
// -----------------------------------------------------------------------------

'use strict';

// native node packages
const http = require('http');
const path = require('path');

// express packages
const express = require('express');
const session = require('express-session');
const logger = require('morgan');
const logConfig = require('./utils/log-config');
const helmet = require('helmet');

const compression = require('compression');
const app = express();
const passport = require('passport');
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (nodeEnv === 'production') {
  app.use(compression());
}

// HTTP access log
app.use(logger(logConfig.format, logConfig.options));

//
// clean headers
//
app.use(helmet({
  hidePoweredBy: false
}));
app.use(helmet.referrerPolicy({ policy: 'no-referrer' }));
// ----------------------------------------
// CSP Content Security Policy
// ----------------------------------------
app.use(helmet.contentSecurityPolicy({
  directives:
    {
      defaultSrc: ["'none'"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      styleSrc: ["'self'"],
      mediaSrc: ["'self'"],
      imgSrc: ["'self'"]
    }
}));

// Route: /status    Is the server alive?
app.get('/status', (req, res) => res.json({ status: 'ok' }));

// Route for security.txt
app.get('/.well-known/security.txt', securityContact);

// From this point, reject all requests not maching vhost domain name
app.use(checkVhost.rejectNotVhost);

// -----------------------------------------------------------------
// express-session
// -----------------------------------------------------------------

const sessionOptions = {
  name: 'collab-frontend.sid',
  proxy: false,
  rolling: true,
  resave: false,
  saveUninitialized: false,
  secret: config.session.secret,
  cookie: {
    path: '/',
    // express-session takes maxAge in milliseconds
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
  sessionStore.RedisStore = require('connect-redis')(session);
  const redisOptions = {};
  // must match /etc/redis/redis.conf "requirepass <password>"
  if ((config.session.redisPassword) && (config.session.redisPassword.length > 0)) {
    redisOptions.password = config.session.redisPassword;
  }
  sessionStore.redisClient = sessionStore.redis.createClient(redisOptions);
  sessionOptions.store = new sessionStore.RedisStore({
    client: sessionStore.redisClient,
    prefix: config.session.redisPrefix
    // ttl: (inherits from cookie)
  });
} else {
  console.log('Using memorystore for session storage');
  sessionStore.MemoryStore = require('memorystore')(session);
  sessionOptions.store = new sessionStore.MemoryStore({
    // memorystore in milliseconds
    ttl: config.session.maxAge,
    stale: true,
    checkPeriod: 86400000 // prune every 24 hours
  });
}
app.use(session(sessionOptions));

// -----------------------
//     Passport OAuth2
// -----------------------
app.use(passport.initialize());
app.use(passport.session());
require('./auth/passport-config');

// Route for robot policy
app.get('/robots.txt', robotPolicy);

// Edge case, IOS iPhone brwoser request
// favicon.ico without cookie, causing
// new authorization workflow to start
app.get('/favicon.ico', (req, res) => { res.end(); });

// -----------------------------
// Unauthorized Landing Page
// -----------------------------
app.get('/unauthorized.html', unAuthRoute.unAuthHtml);
app.get('/unauthorized.css', unAuthRoute.unAuthStyles);

// -------------------------
// Authorizaton Routes
// -------------------------
app.get('/login', passport.authenticate('oauth2'));
//
// Authorization callback route
// Return /login/callback to exchange authoriztion code for access token.
// See below for /redirect.html
// An auth server redirect back with "/login/callback?error=access_denied"
// will issue standard 401 Unauthorized unless failureRedirect URL is defined.
//
app.get('/login/callback',
  passport.authenticate('oauth2'),
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

// ----------------
// Mock REST API
// ----------------
app.use('/api',
  auth.check(),
  apiProxy
);

// -----------------------
// Authenticated status
// -----------------------
app.get('/secure',
  auth.check(),
  (req, res) => res.json({ secure: 'ok' })
);

// -------------------------------
// Web server for static files
// -------------------------------
const secureDir = path.join(__dirname, '../secure');
console.log('Serving files from: ' + secureDir);
app.use(
  auth.check({ redirectURL: '/unauthorized.html' }),
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
  if (nodeEnv === 'production') {
    console.log(message);
    return res.set('Content-Type', 'text/plain').status(status).send(message);
  } else {
    console.log(err);
    return res.set('Content-Type', 'text/plain').status(status).send(message + '\n' + err.stack);
  }
});

module.exports = app;
