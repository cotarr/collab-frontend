'use strict';

// const fs = require('fs');
const express = require('express');
const proxy = require('express-http-proxy');
const router = express.Router();
const addAccessToken = require('../auth/add-access-token').addAccessToken;

const config = require('../config');
const nodeEnv = process.env.NODE_ENV || 'development';

//
// For added security, do not expose user's cookie to resource server
//
const removeReqCookie = (req, res, next) => {
  // Remove cookie from HTTP headers in request object
  // Note: this only removed 1 cookie
  //
  if ('cookie' in req.headers) {
    delete req.headers.cookie;
  }
  // remove cookie from raw headers
  let rawIndex = -1;
  if (req.rawHeaders.length > 1) {
    for (let i = 0; i < req.rawHeaders.length; i++) {
      if (req.rawHeaders[i].toString().toLowerCase() === 'cookie') {
        rawIndex = i;
      }
    }
  }
  req.rawHeaders.splice(rawIndex, 2);
  next();
};

const proxyOptions = {
  proxyErrorHandler: function (err, res, next) {
    // 502 = Bad Gateway
    err.status = 502;
    return next(err);
  },
  timeout: 5000 // milliseconds
};
if (nodeEnv === 'production') {
  proxyOptions.https = true;
  proxyOptions.rejectUnauthorized = true;
}

//
// the /api/* routes from app.js use this router
// Middleware addAccessToken will place access_token in request
// as a Bearer token in Authorization header before reverse proxy.
// The resource servers do not need to know the users cookie
//
router.use('/',
  addAccessToken,
  removeReqCookie,
  proxy(config.remote.apiURL, proxyOptions));

module.exports = router;
