//
// Local web server user logout
//
// ---------------------------------------
// Example implementation
// ---------------------------------------
//
//   app.get('/logout', logout.logout);
//   app.get('/logout.css', logout.logoutServeCss);
//
// ---------------------------------------
'use strict';

const fs = require('fs');

const logout1Html = fs.readFileSync('./server/fragments/logout1.html', 'utf8');
const logout2Html = fs.readFileSync('./server/fragments/logout2.html', 'utf8');
const logoutStyles = fs.readFileSync('./server/fragments/logout.css', 'utf8');

const config = require('../config');

/**
 * Local server logout route handler, use passport logout() method to clear user from session
 */
const logoutHtml =
  logout1Html +
  'You have been successfully logged out of the web server at ' +
   config.oauth2.mainURL + '. ' +
  'You may still be logged in to the authorization server at ' + config.oauth2.authURL + '. ' +
  'This may allow automatic login upon returning to this site. ' +
  'You may remove your authoriztion server login at this link: ' +
  '<a href="' + config.oauth2.authURL + '/logout">' + config.oauth2.authURL + '/logout</a>.' +
  logout2Html;
exports.logout = (req, res, next) => {
  req.logout();
  res.send(logoutHtml);
};

exports.logoutServeCss = (req, res, next) => {
  res.set('Content-Type', 'text/css').send(logoutStyles);
};
