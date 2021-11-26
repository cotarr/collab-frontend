//
// Local web server user logout
//
// ---------------------------------------
// Example implementation
// ---------------------------------------
//
//   app.get('/unauthorized.html', unAuthRoute.unAuthHtml);
//   app.get('/unauthorized.css', unAuthRoute.unAuthStyles);
//
// ---------------------------------------
'use strict';

const fs = require('fs');

const unAuthHtml = fs.readFileSync('./server/fragments/unauthorized.html', 'utf8');
const unAuthStyles = fs.readFileSync('./server/fragments/unauthorized.css', 'utf8');

exports.unAuthHtml = (req, res, next) => {
  res.send(unAuthHtml);
};

exports.unAuthStyles = (req, res, next) => {
  res.set('Content-Type', 'text/css').send(unAuthStyles);
};
