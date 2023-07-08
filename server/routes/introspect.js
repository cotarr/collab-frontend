'use strict';

const getAccessToken = require('../auth/add-access-token').getAccessToken;

const config = require('../config');
// const nodeEnv = process.env.NODE_ENV || 'development';

/**
 * Send access token to authorization server for validation and meta-data lookup.
 * @param {Object} req - Express request object
 * @param {Function} callback - Callback returns introspect data or error
 */
const fetchIntrospect = (req, callback) => {
  const accessToken = getAccessToken(req);
  if (accessToken) {
    const clientAuth = Buffer.from(config.oauth2.clientId + ':' +
      config.oauth2.clientSecret).toString('base64');
    const body = {
      access_token: accessToken
    };
    const fetchController = new AbortController();
    const fetchURL = config.oauth2.authURL + '/oauth/introspect';
    const fetchOptions = {
      method: 'POST',
      redirect: 'error',
      cache: 'no-store',
      signal: fetchController.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Basic ' + clientAuth
      },
      body: JSON.stringify(body)
    };
    const fetchTimerId = setTimeout(() => fetchController.abort(), 5000);
    fetch(fetchURL, fetchOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          // Retrieve error message from remote web server and pass to error handler
          return response.text()
            .then((remoteErrorText) => {
              const err = new Error('HTTP status error');
              err.status = response.status;
              err.statusText = response.statusText;
              err.remoteErrorText = remoteErrorText;
              if (response.headers.get('WWW-Authenticate')) {
                err.oauthHeaderText = response.headers.get('WWW-Authenticate');
              }
              throw err;
            });
        }
      })
      .then((introspect) => {
        // console.log(introspect);
        if (fetchTimerId) clearTimeout(fetchTimerId);
        callback(null, introspect);
      })
      .catch((err) => {
        if (fetchTimerId) clearTimeout(fetchTimerId);
        // Build generic error message to catch network errors
        let message = ('Fetch error, ' + fetchOptions.method + ' ' + fetchURL + ', ' +
          (err.message || err.toString() || 'Error'));
        if (err.status) {
          // Case of HTTP status error, build descriptive error message
          message = ('HTTP status error, ') + err.status.toString() + ' ' +
            err.statusText + ', ' + fetchOptions.method + ' ' + fetchURL;
        }
        if (err.remoteErrorText) {
          message += ', ' + err.remoteErrorText;
        }
        if (err.oauthHeaderText) {
          message += ', ' + err.oauthHeaderText;
        }
        const error = new Error(message);
        if (err.status) error.status = err.status;
        callback(error);
      });
  } else {
    const err = new Error('Access token not found');
    callback(err);
  }
};

/**
 * Middleware function to send response with token meta-data, or send error
 */
const user = (req, res, next) => {
  fetchIntrospect(req, (err, data) => {
    if (err) {
      if ((err.status) && (err.status === 401)) {
        // Special case, this is passing through status of the auth server
        return res.status(401).send('Unauthorized');
      } else if ((err.status) && (err.status === 403)) {
        // Special case, this is passing through status of the auth server
        return res.status(403).send('Forbidden');
      } else {
        // else, bad gateway as if proxy server
        return res.status(502).send('Bad Gateway');
      }
    } else {
      const user = {
        id: data.user.id,
        number: data.user.number,
        username: data.user.username,
        name: data.user.name,
        scope: data.scope
      };
      res.json(user);
    }
  });
};

/**
 * Middleware funciton to send response with user data, or send error
 */
const introspect = (req, res, next) => {
  fetchIntrospect(req, (err, data) => {
    if (err) {
      //
      // This route is a demonstration of oauth2 token as seen by the web server.
      // For this demo, oauth2 server fetch errors are passed to the browser for display.
      // In normal situations, the this would not be visible to the user in the web browser.
      // The error is available to backend code if needed for logging or other purposes.
      //
      let statusCode = 500;
      if ((err.status) && (err.status >= 400)) {
        statusCode = err.status;
      }
      return res.status(statusCode).send('Introspect fetch error: ' + err.message);
    } else {
      res.json(data);
    }
  });
};

module.exports = {
  introspect,
  user
};
