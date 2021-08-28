// ----------------------------------------------------------
// This is a route that will display a blank page, with same
// background color as the main page. After timer expires
// it will redirect back to "/" main page.
//
// This is a workaround to address issue where main page "/"
// session not being authenitcated on first redirect,
// which causes a redirect back to oauth provider site.
//
// This page does not require authentication.
// ----------------------------------------------------------
'use strict';

const express = require('express');
const router = express.Router();

//
// HTML
//
router.get('/redirect.html', (req, res, next) => {
  res.send(
    '<html><link rel="stylesheet" href="redirect.css">' +
    '<script src="redirect.js" defer></script><html>');
});
//
// JavaScript
//
router.get('/redirect.js', (req, res, next) => {
  res.set('Content-Type', 'application/javascript')
    .send('setTimeout(() => { window.location = "/"; }, 100);');
});
//
// Style CSS
//
router.get('/redirect.css', (req, res, next) => {
  res.set('Content-Type', 'text/css').send('body { background-color: #fadd7d; }');
});

module.exports = router;
