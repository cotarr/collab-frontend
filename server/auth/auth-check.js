'use strict';

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
// function to check if request is authorized
//
exports.denyUnauthorized = (req, res, next) => {
  if ((req.isAuthenticated) && (req.isAuthenticated())) {
    next();
  } else {
    if (req.session) {
      if ((req._parsedOriginalUrl) && (req._parsedOriginalUrl.pathname)) {
        req.session.returnTo = req._parsedOriginalUrl.pathname;
      }
      return res.status(401).send('Unauthorized');
    }
  }
};
