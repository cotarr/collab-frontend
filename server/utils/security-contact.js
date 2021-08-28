
// ----------------------------------------------
// security.txt security notification contact
// ----------------------------------------------
//
// In app.js:
//     const securityContact = require('../util/security-contact');
//     // Route for security.txt
//     app.use(securityContact);
//
// ----------------------------------------------
// Reference: https://securitytxt.org/
// Reference: https://datatracker.ietf.org/doc/html/draft-foudil-securitytxt
//
// Required Format
// Contact: mailto:security@example.com
// Expires: Fri, 1 Apr 2022 08:30 -0500
// ----------------------------------------------
'use strict';

const express = require('express');
const router = express.Router();
const config = require('../config');

router.get('/.well-known/security.txt', function (req, res, next) {
  if (config.site.securityContact.length > 0) {
    res.set('Content-Type', 'text/plain');
    res.send(
      '# Website security contact \r\n' +
      'Contact: ' + config.site.securityContact + '\r\n' +
      'Expires: ' + config.site.securityExpires + '\r\n'
    );
  } else {
    next();
  }
});

module.exports = router;
