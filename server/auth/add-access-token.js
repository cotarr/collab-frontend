/**
 * Middleware to add OAuth2 access-token to request headers
 */
exports.addAccessToken = (req, res, next) => {
  if ((req.user) && (req.user.ticket) && (req.user.ticket.access_token)) {
    req.headers.Authorization = 'Bearer ' + req.user.ticket.access_token;
    next();
  } else {
    const err = new Error('Token not found');
    next(err);
  }
};

/**
 * Extract OAuth2 access-token from request header
 * @param   {Object} req - Express request object
 * @returns {String} Returns access_token or undefined
 */
exports.getAccessToken = (req) => {
  if ((req.user) && (req.user.ticket) && (req.user.ticket.access_token)) {
    return req.user.ticket.access_token;
  } else {
    return undefined;
  }
};
