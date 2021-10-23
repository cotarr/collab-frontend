'use strict';

const passport = require('passport');

exports.ensureAuthenticated = (req, res, next) => {
  if ((req.isAuthenticated) && (req.isAuthenticated())) {
    if ((req.session) && (req.session.returnTo)) {
      delete req.session.returnTo;
    }
    next();
  } else {
    if (req.session) {
      if ((req._parsedOriginalUrl) && (req._parsedOriginalUrl.pathname)) {
        req.session.returnTo = req._parsedOriginalUrl.pathname;
      }
      return res.redirect('/login');
    }
  }
};

//
// function to check if request using passport refresh middleware
// This will obtain a new token if needed
//
exports.denyUnauthorized = passport.authenticate('main', { noredirect: true });
