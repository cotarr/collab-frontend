const config = require('../config');
const nodeEnv = process.env.NODE_ENV || 'development';

/**
 * Middleware to add OAuth2 access-token to request headers
 */
exports.addAccessToken = (req, res, next) => {
  if (('authInfo' in req) && ('access_token' in req.authInfo)) {
    req.headers.Authorization = 'Bearer ' + req.authInfo.access_token;
    next();
  } else {
    const err = new Error('Token not found');
    next(err);
  }
};

/**
 * Extract OAuth2 access-token from request header
 * @param   {Object} Express request object
 * @returns {String} Returns access_token or undefined
 */
exports.getAccessToken = (req) => {
  if (('authInfo' in req) && ('access_token' in req.authInfo)) {
    return req.authInfo.access_token;
  } else {
    return undefined;
  }
};
