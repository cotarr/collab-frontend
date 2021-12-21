'use strict';
//
// Demo web site - JavaScript controller
//
// The purpose of this web site is to demonstrate
//  1) Automatic redirect to authorization server for user login
//        This is accomplished by traping errors retrieving user information.
//        Alternately, the user's name is displayed in the banner.
//  2) Login, logout, and change password user functions
//        The HTML contains links and buttons to interact with authorization server.
//  3) User initiated API request and display of retrieved data on web page.
//        API fetch request is in separate file api-data.js.
//  4) For demonstration purposes, the access token can be decoded and displayed.
//        In a normal web site, the token is not available to the user.
//
// -------------------
// Internal function
// -------------------
const fetchUserInfo = (callback) => {
  const fetchUrl = '/userinfo';
  const fetchOptions = {
    method: 'GET',
    timeout: 5000,
    headers: {
      Accept: 'application/json'
    }
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
    .then((json) => {
      // console.log(JSON.stringify(json, null, 2));
      callback(null, json);
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    });
}; // showLoginStatus()

// ---------------------------------------------------
// Callback function to update page header with username
// ---------------------------------------------------
const loadCallback = (err, data) => {
  if (err) {
    document.getElementById('headerName').textContent = '';
    window.location = '/unauthorized';
  } else if ((data) && ('name' in data)) {
    document.getElementById('headerName').textContent = data.name;
  } else {
    document.getElementById('headerName').textContent = '';
    window.location = '/unauthorized';
  }
}; // loadCallback()

// --------------------------
// Event handler for page load
// --------------------------
window.onload = (event) => {
  setTimeout(() => {
    fetchUserInfo(loadCallback);
  }, 250);
};
