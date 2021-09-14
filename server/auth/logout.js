//
// Local web server user logout
//
// ---------------------------------------
// Example implementation
// ---------------------------------------
//
// app.get('/logout',
//   logout.skipLogoutIfNeeded,
//   passport.authenticate('main', { noredirect: true }),
//   logout.fullLogoutWithTokenRevoke
// );
// app.get('/logout.css', logout.logoutServeCss);
//
// ---------------------------------------
'use strict';

const fs = require('fs');
const fetch = require('node-fetch');
const config = require('../config');

const logoutHtml = fs.readFileSync('./server/fragments/logout.html', 'utf8');
const logoutStyles = fs.readFileSync('./server/fragments/logout.css', 'utf8');

/**
 * Middleware to skip logout if not currently logged in
 */
exports.skipLogoutIfNeeded = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.send(logoutHtml);
  }
};

/**
 * Local server logout route handler
 *
 * The /logout route
 *   1) Request revoke access-token and refresh-token in same request
 *   2) Logout of local passport session
 *   3) Display logout confirmation
 *
 */
exports.fullLogoutWithTokenRevoke = (req, res, next) => {
  // Internal function to use session method to remove current session
  const _destroySessionAndRenderPage = (req, res, next) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return next(err);
        } else {
          return res.send(logoutHtml);
        }
      });
    } else {
      return res.send(logoutHtml);
    }
  }; // _destroySessionAndRenderPage

  //
  // Check if access_token is stored in session
  // If access token is found, then revoke both
  // access_token and refresh_token.
  //
  if (req.isAuthenticated()) {
    if (('authInfo' in req) && ('access_token' in req.authInfo)) {
      const fetchUrl = config.oauth2.authURL + '/oauth/token/revoke';
      const clientAuth = Buffer.from(config.oauth2.clientId + ':' +
        config.oauth2.clientSecret).toString('base64');
      const body = {
        access_token: req.authInfo.access_token
      };
      if ('refresh_token' in req.authInfo) {
        body.refresh_token = req.authInfo.refresh_token;
      }
      const fetchOptions = {
        method: 'POST',
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Basic ' + clientAuth
        },
        body: JSON.stringify(body)
      };
      //
      // POST request to revoke access-token and refresh_token
      //
      fetch(fetchUrl, fetchOptions)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Fetch status ' + response.status + ' ' +
            fetchOptions.method + ' ' + fetchUrl);
          }
        })
        .then(() => {
          // case of successful token revoke, remove session and display page
          return _destroySessionAndRenderPage(req, res, next);
        })
        .catch((err) => {
          // case of error revoking one or both tokens, remove session and display page
          console.log(err);
          return _destroySessionAndRenderPage(req, res, next);
        });
    } else {
      // Case of no access token found in session, simply delete session and render page
      return _destroySessionAndRenderPage(req, res, next);
    }
  } else {
    // Not currently authenticated, display logout message without other actions
    return res.send(logoutHtml);
  }
};

exports.logoutServeCss = (req, res, next) => {
  res.set('Content-Type', 'text/css').send(logoutStyles);
};
