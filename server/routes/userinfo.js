'use strict';

const fetch = require('node-fetch');

const config = require('../config');
// const nodeEnv = process.env.NODE_ENV || 'development';

const fetchIntrospect = (req, callback) => {
  if ((req.authInfo) && (req.authInfo.access_token)) {
    const clientAuth = Buffer.from(config.oauth2.clientId + ':' +
      config.oauth2.clientSecret).toString('base64');
    const body = {
      access_token: req.authInfo.access_token
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
          throw new Error('Fetch status ' + response.status + ' ' +
          fetchOptions.method + ' ' + fetchUrl);
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

const user = (req, res, next) => {
  fetchIntrospect(req, (err, data) => {
    if (err) {
      console.log(err.message);
      res.json({});
    } else {
      const user = { username: data.user.username, name: data.user.name };
      res.json(user);
    }
  });
};

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
