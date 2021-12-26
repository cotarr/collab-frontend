'use strict';
//
// Emulation of REST API data retrieval
//
// This file contains a function to retrieve mock data
// from an emulated database.
//
// The purpose is to demonstrate use of an oauth access token
// to authorize the API call to the backend.
//
// ---------------------------------------------------

// ---------------------------------------------
// Event handlers for buttons, mock API requests
// ---------------------------------------------
document.getElementById('iotDataButton').addEventListener('click', () => {
  const fetchOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  };
  const fetchUrl = '/api/v1/data/iot-data/';
  fetch(fetchUrl, fetchOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        let errorString = 'Fetch status ' + response.status + ' ' +
          fetchOptions.method + ' ' + fetchUrl;
        // This is for demonstration and debugging purposes.
        // If WWW-Authentication header is present, append it.
        const wwwAuthenticateHeader = response.headers.get('WWW-Authenticate');
        if (wwwAuthenticateHeader) {
          errorString += ' WWW-Authenticate header: ' + wwwAuthenticateHeader;
        }
        throw new Error(errorString);
      }
    })
    .then((json) => {
      // console.log(JSON.stringify(json, null, 2));
      document.getElementById('apiDataText').textContent = JSON.stringify(json, null, 2);
      if ((Array.isArray(json)) && (json.length === 0)) {
        document.getElementById('apiErrorText').textContent =
          'Success. [ ] indicates an empty array. ' +
          'It is likely the emulated IOT device has not submitted any data.';
      } else {
        document.getElementById('apiErrorText').textContent = '';
      }
    })
    .catch((err) => {
      console.log(err);
      document.getElementById('apiDataText').textContent = '';
      document.getElementById('apiErrorText').textContent = err.message || err.toString();
    });
});

// -----------------------------------
// Button handler to clear display data
// -----------------------------------
document.getElementById('clearDisplayButton').addEventListener('click', () => {
  document.getElementById('apiDataText').textContent = '';
  document.getElementById('apiErrorText').textContent = '';
});