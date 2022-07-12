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

//
// HTML fragment
//
const logoutHtml =
  logout1Html +
  'Logout successful for the web server at ' +
   config.oauth2.mainURL + '.' +
  '<br><br>' +
  'You may still be logged in to the authorization server at ' + config.oauth2.authURL + '. ' +
  'You may remove your authoriztion server login by visiting the link at: ' +
  '<a href="' + config.oauth2.authURL + '/logout">' + config.oauth2.authURL + '/logout</a>.' +
  ' ' +
  '<a href="' + config.oauth2.authURL + '/logout"><button>Auth Logout</button></a>' +
  logout2Html;

/**
 * Local server /logout route handler
 */
exports.logout = (req, res, next) => {
  // callback function added to support passport v0.6.0 upgrade
  req.logout(function (err) {
    if (err) {
      return next(err);
    } else {
      res.send(logoutHtml);
    }
  });
};

/**
 * Local server /styles.css route handler
 */
exports.logoutServeCss = (req, res, next) => {
  res.set('Content-Type', 'text/css').send(logoutStyles);
};
