// ----------------------------------------------------------
// This is a route that will display login confirmation
//
// This page does not require authentication.
// ----------------------------------------------------------
'use strict';

const fs = require('fs');
const express = require('express');
const router = express.Router();

// content
const html = fs.readFileSync('./server/fragments/loggedout.html', 'utf8');
const styles = fs.readFileSync('./server/fragments/loggedout.css', 'utf8');
//
// HTML
//
router.get('/loggedout.html', (req, res, next) => {
  res.send(html);
});
//
// Style CSS
//
router.get('/loggedout.css', (req, res, next) => {
  res.set('Content-Type', 'text/css').send(styles);
});

module.exports = router;
