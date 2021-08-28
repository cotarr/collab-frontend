
'use strict';
const fetch = require('node-fetch');
const config = require('../config');

// ----------------------------------------------------------
// The /logout route
//   1) Request revoke access-token
//   2) Request revoke refresh-token
//   3) Logout of local passport session
//   4) Redirect to backend /logout to invalidate cookie from auth server
// ----------------------------------------------------------
module.exports = (req, res, next) => {
  if (('authInfo' in req) && ('access_token' in req.authInfo)) {
    console.log('revoking token');
    const fetchUrl1 = config.oauth2.authURL + '/api/revoke?token=' + req.authInfo.access_token;
    const fetchUrl2 = config.oauth2.authURL + '/api/revoke?token=' + req.authInfo.refresh_token;
    const fetchOptions = {
      method: 'GET',
      timeout: 5000,
      headers: {
        Accept: 'application/json'
      }
    };
    //
    // Revoke access-token
    //
    fetch(fetchUrl1, fetchOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Fetch status ' + response.status + ' ' +
          fetchOptions.method + ' ' + fetchUrl1);
        }
      })
      //
      // Revoke refresh token
      //
      .then((json) => {
        return fetch(fetchUrl2, fetchOptions);
      })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Fetch status ' + response.status + ' ' +
          fetchOptions.method + ' ' + fetchUrl2);
        }
      })
      //
      // Rest is logout local and remote
      //
      .then((json) => {
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
