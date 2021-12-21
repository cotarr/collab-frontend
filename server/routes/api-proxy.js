'use strict';

// const fs = require('fs');
const express = require('express');
const proxy = require('express-http-proxy');
const router = express.Router();
const addAccessToken = require('../auth/add-access-token').addAccessToken;

const config = require('../config');
const nodeEnv = process.env.NODE_ENV || 'development';

const proxyOptions = {
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    // Remove security sensitive headers.
    delete proxyReqOpts.headers.cookie;
    delete proxyReqOpts.headers['csrf-token'];
    return proxyReqOpts;
  },
  proxyErrorHandler: (err, res, next) => {
    // 502 = Bad Gateway
    err.status = 502;
    return next(err);
  },
  timeout: 5000 // milliseconds
};
if (nodeEnv === 'production') {
  proxyOptions.https = true;
  // TLS certificate host verification
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
  proxy(config.remote.apiURL, proxyOptions));

module.exports = router;
