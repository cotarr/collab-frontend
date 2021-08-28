'use strict';

// const fs = require('fs');
const express = require('express');
const proxy = require('express-http-proxy');
const router = express.Router();

const config = require('../config');
const nodeEnv = process.env.NODE_ENV || 'development';

//
// Add OAuth2 access-token to request headers
//
const addTokenMiddleware = (req, res, next) => {
  if (('authInfo' in req) && ('access_token' in req.authInfo)) {
    req.headers.Authorization = 'Bearer ' + req.authInfo.access_token;
    next();
  } else {
    const err = new Error('Token not found');
    next(err);
  }
};

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

router.use('/',
  addTokenMiddleware,
  removeReqCookie,
  proxy(config.remote.apiURL, proxyOptions));

module.exports = router;
