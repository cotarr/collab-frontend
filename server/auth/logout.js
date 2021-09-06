
'use strict';
const fetch = require('node-fetch');
const config = require('../config');

// ----------------------------------------------------------
// The /logout route
//   1) Request revoke access-token and refresh-token in same request
//   3) Logout of local passport session
//   4) Redirect to backend /logout to invalidate cookie from auth server
// ----------------------------------------------------------
module.exports = (req, res, next) => {
  if (('authInfo' in req) && ('access_token' in req.authInfo)) {
    const fetchUrl = config.oauth2.authURL + '/oauth/token/revoke';
    const clientAuth = Buffer.from(config.oauth2.clientId + ':' +
      config.oauth2.clientSecret).toString('base64');
    const body = {
      access_token: req.authInfo.access_token
    };
    if ('refresh_token' in req.authInfo) {
      body.refresh_token = req.authInfo.refresh_token;
    }

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
    //
    // Revoke access-token and refresh_token
    //
    fetch(fetchUrl, fetchOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Fetch status ' + response.status + ' ' +
          fetchOptions.method + ' ' + fetchUrl);
        }
      })
      .then(() => {
        req.logout();
        return res.redirect('/loggedout.html');
      })
      .catch((err) => {
        console.log(err);
        req.logout();
        return res.redirect('/loggedout.html');
      });
  } else {
    req.logout();
    return res.redirect('/loggedout.html');
  }
};
