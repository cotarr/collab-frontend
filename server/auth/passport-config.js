// -----------------------------------------------------------------
// Passport strategy for oauth2
//
// See docs: https://www.npmjs.com/package/passport-oauth2
//
// Default configuration in server/config/index.js can be
// overridden using environment variables.
//
//
//     Web Server     Authorization server
//     ==========     ====================
//     /login         /dialog/authorize (with query params)
//                    /login
//                    /dialog/authorize (with remembered query params)
//                    /dialog/authorize/decision  (untrusted client)
//     /login/callback
//                    /oauth/token (exchange code for token)
//     /redirect.html
//     / (main page)
//
// The "scope" included in the request as a query parameter is
// the request scope.
//     Client allowedScope = possible user scopes allowed by client
//     User   role         = possible user scopes
//     Request scope       = web server limits included in query params
//  Issued token scope is intersection of the three.
//
//  Example:  Client definition needs "auth.token" to issue user tokens
//            Client needs all possible user scopes ("read", "write")
//
//            Client allowScope    = ["read", "write", "auth.token"]
//            Request query params = ["read", "write"]
//            User role            = ["read"]
//
//            Therefore, the issued token scope is ["read"]
//
//  Added to session storage:
//    req.session.passport.user.ticket = {
//      access_token: 'xxxxxx',
//      refresh_token: 'xxxxxx',
//      exp: 1637786886
//    }
//
// -----------------------------------------------------------------
'use strict';

// Oauth/Passport packages
const OAuth2Strategy = require('passport-oauth2');
const passport = require('passport');

const config = require('../config');

const oauth2Strategy = new OAuth2Strategy(
  {
    authorizationURL: config.oauth2.authURL + '/dialog/authorize',
    tokenURL: config.oauth2.authURL + '/oauth/token',
    clientID: config.oauth2.clientId,
    clientSecret: config.oauth2.clientSecret,
    callbackURL: config.oauth2.mainURL + '/login/callback',
    passReqToCallback: false,
    scope: config.oauth2.requestedScope,
    state: true
  },
  function (accessToken, refreshToken, profile, cb) {
    if ((!(accessToken == null)) && (accessToken.length > 0)) {
      const ticket = {
        access_token: accessToken
      };
      if ((!(refreshToken == null)) && (refreshToken.length > 0)) {
        ticket.refresh_token = refreshToken;
      }
      // extract expiration time in unix seconds from base64 encoded token payload.
      try {
        ticket.exp =
          parseInt(JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString()).exp);
      } catch (error) {
        console.log(error.toString() || error);
        delete ticket.exp;
      }
      return cb(null, { ticket });
    } else {
      const err = new Error('Invalid access_token during login');
      cb(err);
    }
  }
);

passport.use('oauth2', oauth2Strategy);

// -------------------------------------------------
// Normally, session stores only user index,
// and user + token is stored elsewhere.
// This is not currently implemented.
// Therefore, entire user object will be serialized
// into the session, including acccess and refresh tokens
// -------------------------------------------------
passport.serializeUser((user, done) => {
  // Serialize entire user
  done(null, user);
});
//
passport.deserializeUser((user, done) => {
  // Deserialize entire user
  done(null, user);
});
