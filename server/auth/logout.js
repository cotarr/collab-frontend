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
 * Local server logout route handler
 * 
 * Use passport logout() method to clear user from session
 */
exports.logout = (req, res, next) => {
  req.logout();
  res.send(logoutHtml);
};

exports.logoutServeCss = (req, res, next) => {
  res.set('Content-Type', 'text/css').send(logoutStyles);
};
