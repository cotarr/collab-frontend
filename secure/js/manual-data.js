'use strict';
//
// Emulation of REST API edit data manually
//
// This file contains a function with method GET to
// retrieve mock data from an emulated database.
//
// The file contains a function with method PATCH to
// manually modify an existing record
//
// The purpose is to demonstrate use of an oauth access token
// to authorize the API call to the backend.
//
// The operation also uses a CSRF Token to mitigate
// CSRF risks. It also demonstrates sanitizing
// character input.
//
// ---------------------------------------------------

// --------------------------
//  Internal fetch function
//  Method: GET
// --------------------------
const getManualEditData = (endpointUrl) => {
  const fetchUrl = endpointUrl;
  const fetchOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  };
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
      document.getElementById('manualEditText').textContent = JSON.stringify(json, null, 2);
      document.getElementById('manualEditErrorText').textContent = '';
    })
    .catch((err) => {
      console.log(err);
      document.getElementById('manualEditText').textContent = '';
      document.getElementById('manualEditErrorText').textContent = err.message || err.toString();
    });
}; // getTestApiData()

// ---------------------------------------------
// Event handlers for buttons, mock API requests
// ---------------------------------------------
document.getElementById('manualEditButton2').addEventListener('click', () => {
  getManualEditData('/api/v1/data/manual-data/435bf533-7280-4dce-a9d0-2960b43019f9');
});

// --------------------------
//  Internal fetch function
//  Method Patch
// --------------------------
const patchManualEditData = (endpointUrl, data) => {
  const fetchUrl = endpointUrl;
  const fetchOptions = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(data)
  };
  // Add CSRF token to request headers.
  //
  // This is to demonstrate the use of CSRF tokens to reduce risk
  // of cross site transactions. It uses npm package csurf
  // on the web server to insert the CSRF token into the HTML
  // as a meta-tag.
  //
  if (document.getElementById('csrfHeaderCheckbox').checked) {
    fetchOptions.headers['CSRF-Token'] =
      document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  }
  fetch(fetchUrl, fetchOptions)
    .then((response) => {
      if (response.ok) {
        return {
          ok: response.ok,
          status: response.status
        };
      } else {
        let errorString = 'Fetch status ' + response.status + ' ' +
          fetchOptions.method + ' ' + fetchUrl;
        // This is for demonstration and debugging purposes.
        // If WWW-Authentication header is present, append it.
        const wwwAuthenticateHeader = response.headers.get('WWW-Authenticate');
        if (wwwAuthenticateHeader) {
          errorString += ' WWW-Authenticate header: ' + wwwAuthenticateHeader;
        }
        if (response.status === 422) {
          errorString = 'Input Validation Error, ' + errorString;
        }
        throw new Error(errorString);
      }
    })
    .then((json) => {
      console.log(JSON.stringify(json, null, 2));
      document.getElementById('manualEditText').textContent =
        'Success, response status=' + json.status.toString() + ' OK';
      document.getElementById('manualEditErrorText').textContent = '';
    })
    .catch((err) => {
      console.log(err);
      document.getElementById('manualEditText').textContent = '';
      document.getElementById('manualEditErrorText').textContent = err.message || err.toString();
    });
}; // getTestApiData()

// ---------------------------------------------
// Event handlers for buttons, mock API requests
// ---------------------------------------------
document.getElementById('manualEditButton1').addEventListener('click', () => {
  const data = {
    id: '435bf533-7280-4dce-a9d0-2960b43019f9'
  };
  data.weather = document.getElementById('weatherInputEl').value;
  console.log(JSON.stringify(data, null, 2));
  patchManualEditData('/api/v1/data/manual-data/435bf533-7280-4dce-a9d0-2960b43019f9', data);
});

window.addEventListener('load', (event) => {
  const csrfToken =
    document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  if (csrfToken === '{{csrfToken}}') {
    console.log('The {{csrfToken}} was not replaced with dynamic data');
    document.getElementById('manualEditText').textContent = '';
    document.getElementById('manualEditErrorText').textContent =
      'Error: CSRF Token not found in page HTML';
  } else {
    document.getElementById('currentCsrfTokenValue').textContent =
     '"' + csrfToken + '"';
  }
});
