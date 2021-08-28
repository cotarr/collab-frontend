// ----------------------------------------------
// Robot exclusion policy
// ----------------------------------------------
//
// In app.js:
//     const robotPolicy = require('../util/robot-policy');
//     // Route for robot policy
//     app.use(robotPolicy);
//
// ----------------------------------------------
'use strict';

const express = require('express');
const router = express.Router();

//
// Robot exclusion policy (robots.txt)
//
router.get('/robots.txt', function (req, res) {
  res.set('Content-Type', 'text/plain');
  res.send(
    'User-agent: *\n' +
    'Disallow: /\n');
});

module.exports = router;
