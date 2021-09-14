// -----------------------------------------------------------------
// Passport strategy for oauth2 workflow using refresh token
//
// See docs: https://www.npmjs.com/package/passport-oauth2
// See docs: https://www.npmjs.com/package/passport-oauth2-middleware
//
// Default configuration in server/config/index.js can be
// overridden using environment variables.
//
// If refresh_token supplied by authorization server,
// then it is used automatically to get new access_token as needed.
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
// -----------------------------------------------------------------
'use strict';

// Oauth/Passport packages
const OAuth2Strategy = require('passport-oauth2');
const OAuth2RefreshTokenStrategy = require('passport-oauth2-middleware').Strategy;
const passport = require('passport');

const config = require('../config');

const refreshStrategy = new OAuth2RefreshTokenStrategy({
  refreshWindow: 10, // Seconds before refresh token
  userProperty: 'ticket', // location of tokens
  authenticationURL: '/login', // Unauthorized user redirect
  callbackParameter: 'callback' // URL query parameter name to pass a return URL
});

passport.use('main', refreshStrategy);

const oauth2Strategy = new OAuth2Strategy(
  {
    authorizationURL: config.oauth2.authURL + '/dialog/authorize',
    tokenURL: config.oauth2.authURL + '/oauth/token',
    clientID: config.oauth2.clientId,
    clientSecret: config.oauth2.clientSecret,
    callbackURL: config.oauth2.mainURL + '/login/callback',
    // passReqToCallback must be false (refresh strategy)
    passReqToCallback: false,
    scope: config.oauth2.requestedScope
  },
  refreshStrategy.getOAuth2StrategyCallback()
);

passport.use('oauth2', oauth2Strategy);
refreshStrategy.useOAuth2Strategy(oauth2Strategy);

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
