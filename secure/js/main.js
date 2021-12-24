'use strict';
//
// Demo web site - JavaScript controller
//
//  Automatic redirect to authorization server for user login
//     This is accomplished by traping errors retrieving user information.
//      Alternately, the user's name is displayed in the banner.
//
// -------------------------------------------------
// Fetch user information from authorization server
// -------------------------------------------------
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
//
// Unauthorized users will be redirected to
// a landing page with a login button.
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
