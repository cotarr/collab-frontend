// -----------------------------------------------------------------
// Passport strategy for bearer token in authorization header
//
// req.headers {
//    authorization: 'Bearer xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
// }
//
// Token scope added to request object in case needed in further processing
//
// req.authInfo {"scope":["xxxxx"]}  <-- From third done argument
// req.isAuthenticated() true
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
    // scope offline_access tells oauth2 to provide a refresh token
    scope: ['offline_access', 'auth.token', 'api.read']
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
