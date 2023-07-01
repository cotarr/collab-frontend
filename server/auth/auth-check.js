'use strict';

const fetch = require('node-fetch');

const config = require('../config');

//
// Authorization Middleware for API routes
//
//   1 - Check if request is authorized (cookie/session)
//   2 - Check if saved access_token is not expired
//   3 - If expired, fetch new access_token using refresh_token
//   4 - Continue request chain by calling next()
//
//  const auth = require('./auth/auth-check')
//  app.get('/api-route', auth.check(), apiRouteHandler);
//  app.get('/index.html', auth.check({ redirectURL: '/login' }), routeHandler)
//
// options = {
//   redirectURL: '/login', // Failed authorization redirect URL
//                          //     if not defined, return 401 unauthorized.
//                          //     if defined, remember original URL
//   ignoreToken: true,     // Use only cookie, ignore token expire time, default = false
//                          //     If ignoreToken === true, refresh token is also disabled.
//   disableRefresh: true   // when token expired, disable use of refresh token, default = false
// }
//
// Unexpected errors return status 401 to user
//
// --------------------------------------

//
// Renew access token if time remaining is less than this value.
//
const renewWindowSec = 10;

/**
 * Authorization middleware
 * @param {Object} options
 * @property {boolean} options.ignoreToken - Authorize using cookie/session, ignoring token
 * @property {string} options.redirectURL - URL saved in session for restoration after redirect
 */
exports.check = (options) => {
  const _options = options || {};

  // This returns authorization middleware function
  return (req, res, next) => {
    //
    // Authorization check: if cookie/session is invald, then deny access with status 401
    //
    if ((!req.isAuthenticated) || (!req.isAuthenticated())) {
      if ((_options.redirectURL) && (_options.redirectURL.length > 0)) {
        if (req.session) {
          if ((req._parsedOriginalUrl) && (req._parsedOriginalUrl.pathname)) {
            req.session.returnTo = req._parsedOriginalUrl.pathname;
          }
        }
        return res.redirect(_options.redirectURL);
      } else {
        return res.status(401).send('Unauthorized');
      }

    //
    // ---------------------------
    // Http request is authorized
    // ---------------------------
    //
    // if refresh token disabled in config, then authorization decision
    // is made using only cookie, and ignoring expire time of stored access_token
    } else if (_options.ignoreToken) {
      if ((_options.redirectURL) && (_options.redirectURL.length > 0) &&
        (req.session) && (req.session.returnTo)) {
        // authorized request, if previous saved URL, remove saved URL
        delete req.session.returnTo;
      }
      // request is authorized, continue nodejs request chain
      return next();

    // Check if user object present in session (contains expiration time)
    } else if ((!req.user) || (!req.user.ticket) || (!req.user.ticket.exp)) {
      const err = new Error('Invalid token exp time');
      return next(err);

    // Compare expiration time to system current time. Is the access token expired?
    } else if ((Math.floor(new Date().getTime() / 1000) + renewWindowSec) <
      parseInt(req.user.ticket.exp)) {
      // Case of: Not expired
      //
      // If saved URL, then removed saved URL
      if ((_options.redirectURL) && (_options.redirectURL.length > 0) &&
        (req.session) && (req.session.returnTo)) {
        delete req.session.returnTo;
      }
      // token not expired, continue nodejs request chain
      return next();

    // -----------------------
    // Token is expired
    // -----------------------
    //
    // Option: Refresh_token disabled in options
    // Treat expired access_token as authorization failure
    //
    } else if (_options.disableRefresh) {
      if ((_options.redirectURL) && (options.redirectURL.length > 0)) {
        if (req.session) {
          if ((req._parsedOriginalUrl) && (req._parsedOriginalUrl.pathname)) {
            req.session.returnTo = req._parsedOriginalUrl.pathname;
          }
        }
        return res.redirect(_options.redirectURL);
      } else {
        return res.status(401).send('Unauthorized');
      }

    // Confirm if ticket object present session passport (will be modified)
    } else if ((!req.session) || (!req.session.passport) || (!req.session.passport.user) ||
      (!req.session.passport.user.ticket)) {
      const err = new Error('Invalid token exp time');
      return next(err);

    //
    // fetch new token from authorization server using Oauth 2.0 refresh_token grant type.
    //
    } else {
      const fetchController = new AbortController();
      const body = {
        client_id: config.oauth2.clientId,
        client_secret: config.oauth2.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: req.user.ticket.refresh_token
      };
      const fetchOptions = {
        method: 'POST',
        redirect: 'error',
        cache: 'no-store',
        signal: fetchController.signal,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(body)
      };
      const fetchURL = config.oauth2.authURL + '/oauth/token';
      const fetchTimerId = setTimeout(() => fetchController.abort(), 5000);
      fetch(fetchURL, fetchOptions)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            // Retrieve error message from remote web server and pass to error handler
            return response.text()
              .then((remoteErrorText) => {
                const err = new Error('HTTP status error');
                err.status = response.status;
                err.statusText = response.statusText;
                err.remoteErrorText = remoteErrorText;
                if (response.headers.get('WWW-Authenticate')) {
                  err.oauthHeaderText = response.headers.get('WWW-Authenticate');
                }
                throw err;
              });
          }
        })
        .then((tokenResponse) => {
          // console.log(tokenResponse);
          if (fetchTimerId) clearTimeout(fetchTimerId);
          const nowSeconds = Math.floor((new Date().getTime()) / 1000);
          const expires = nowSeconds + parseInt(tokenResponse.expires_in);
          req.session.passport.user.ticket.access_token = tokenResponse.access_token;
          req.session.passport.user.ticket.exp = expires;
          req.user.ticket.access_token = tokenResponse.access_token;
          req.user.ticket.exp = expires;
          // If saved URL, then removed saved URL
          if ((_options.redirectURL) && (_options.redirectURL.length > 0) &&
            (req.session) && (req.session.returnTo)) {
            delete req.session.returnTo;
          }
          // update of access_token was successful, continue processing nodejs request chain.
          return next();
        })
        .catch((err) => {
          if (fetchTimerId) clearTimeout(fetchTimerId);
          // Build generic error message to catch network errors
          let message = ('Fetch error, ' + fetchOptions.method + ' ' + fetchURL + ', ' +
            (err.message || err.toString() || 'Error'));
          if (err.status) {
            // Case of HTTP status error, build descriptive error message
            message = ('HTTP status error, ') + err.status.toString() + ' ' +
              err.statusText + ', ' + fetchOptions.method + ' ' + fetchURL;
          }
          if (err.remoteErrorText) {
            message += ', ' + err.remoteErrorText;
          }
          if (err.oauthHeaderText) {
            message += ', ' + err.oauthHeaderText;
          }
          console.log(message);
          // Most likely error is expired refresh_token or invalid refresh_token
          // Treat this is as normal unauthorized response
          if ((_options.redirectURL) && (options.redirectURL.length > 0)) {
            if (req.session) {
              if ((req._parsedOriginalUrl) && (req._parsedOriginalUrl.pathname)) {
                req.session.returnTo = req._parsedOriginalUrl.pathname;
              }
            }
            return res.redirect(_options.redirectURL);
          } else {
            return res.status(401).send('Unauthorized');
          }
        });
    } // else if
  }; // return function()
}; // exports.check
