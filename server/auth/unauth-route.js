//
// Local web server user logout
//
// ---------------------------------------
// Example implementation
// ---------------------------------------
//
//   app.get('/unauthorized', unAuthRoute.unAuthHtml);
//   app.get('/unauthorized.css', unAuthRoute.unAuthStyles);
//
// ---------------------------------------
'use strict';

const fs = require('fs');

const unAuthHtml = fs.readFileSync('./server/fragments/unauthorized.html', 'utf8');
const unAuthStyles = fs.readFileSync('./server/fragments/unauthorized.css', 'utf8');

/**
 * Route handler /unauthorized
 */
exports.unAuthHtml = (req, res, next) => {
  res.send(unAuthHtml);
};

/**
 * Route handler /unauthorized.css
 */
exports.unAuthStyles = (req, res, next) => {
  res.set('Content-Type', 'text/css').send(unAuthStyles);
};
