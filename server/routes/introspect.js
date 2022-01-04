'use strict';

const fetch = require('node-fetch');

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
    const fetchUrl = config.oauth2.authURL + '/oauth/introspect';
    const fetchOptions = {
      method: 'POST',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Basic ' + clientAuth
      },
      body: JSON.stringify(body)
    };
    fetch(fetchUrl, fetchOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          let errorString = 'Fetch status ' + response.status + ' ' +
            fetchOptions.method + ' ' + fetchUrl;
          // If WWW-Authentication header is present, append it.
          const wwwAuthenticateHeader = response.headers.get('WWW-Authenticate');
          if (wwwAuthenticateHeader) {
            console.log('WWW-Authenticate header:', wwwAuthenticateHeader);
            errorString += ' WWW-Authenticate header: ' + wwwAuthenticateHeader;
          }
          const err = new Error(errorString);
          err.status = response.status;
          throw err;
        }
      })
      .then((introspect) => {
        // console.log(introspect);
        callback(null, introspect);
      })
      .catch((err) => {
        console.log(err);
        callback(err);
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
      if ((err.status) && (parseInt(err.status) === 401)) {
        // Special case, this is passing through status of the auth server
        return res.status(401).send('Unauthorized');
      } else if ((err.status) && (parseInt(err.status) === 403)) {
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
      console.log(err.message);
      res.status(502).send('Bad Gateway');
    } else {
      res.json(data);
    }
  });
};

module.exports = {
  introspect,
  user
};
