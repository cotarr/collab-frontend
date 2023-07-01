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
  const fetchController = new AbortController();
  const fetchURL = '/api/v1/data/iot-data/';
  const fetchOptions = {
    method: 'GET',
    redirect: 'error',
    signal: fetchController.signal,
    headers: {
      Accept: 'application/json'
    }
  };
  const fetchTimerId = setTimeout(() => fetchController.abort(), 6000);
  fetch(fetchURL, fetchOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return response.text()
          .then((remoteErrorText) => {
            const err = new Error('HTTP status error');
            err.status = response.status;
            err.statusText = response.statusText;
            err.remoteErrorText = remoteErrorText;
            throw err;
          });
      }
    })
    .then((json) => {
      // console.log(JSON.stringify(json, null, 2));
      if (fetchTimerId) clearTimeout(fetchTimerId);
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
      console.log(message);
      // take only first line for on page display
      message = message.split('\n')[0];
      document.getElementById('apiDataText').textContent = '';
      document.getElementById('apiErrorText').textContent = message;
    });
});

// -----------------------------------
// Button handler to clear display data
// -----------------------------------
document.getElementById('clearDisplayButton').addEventListener('click', () => {
  document.getElementById('apiDataText').textContent = '';
  document.getElementById('apiErrorText').textContent = '';
});

document.getElementById('scopeFailButton').addEventListener('click', () => {
  // Extract csrf token from meta tag at top of html page.
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  // check that csrf token exists and valid, else show error
  if ((!(csrfToken == null)) && (csrfToken.length > 0) && (csrfToken !== '{{csrfToken}}')) {
    const fetchController = new AbortController();
    // Attempt to modify a record id = 1
    const fetchURL = '/api/v1/data/iot-data/1';
    const putBody = {
      id: 1,
      deviceId: 'iot-device-12',
      timestamp: '2021-09-17T15:32:08.417Z',
      data1: 24.831,
      data2: 27.241,
      data3: 22.307
    };
    const fetchOptions = {
      method: 'PUT',
      redirect: 'error',
      signal: fetchController.signal,
      body: JSON.stringify(putBody),
      headers: {
        'CSRF-Token': csrfToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    };
    const fetchTimerId = setTimeout(() => fetchController.abort(), 6000);
    fetch(fetchURL, fetchOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.text()
            .then((remoteErrorText) => {
              const err = new Error('HTTP status error');
              err.status = response.status;
              err.statusText = response.statusText;
              err.remoteErrorText = remoteErrorText;
              throw err;
            });
        }
      })
      .then((json) => {
        // console.log(JSON.stringify(json, null, 2));
        if (fetchTimerId) clearTimeout(fetchTimerId);
        document.getElementById('scopeFailText').textContent = JSON.stringify(json, null, 2);
        document.getElementById('scopeFailErrorText').textContent = '';
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
        console.log(message);
        // take only first line for on page display
        message = message.split('\n')[0];
        document.getElementById('scopeFailText').textContent = '';
        document.getElementById('scopeFailErrorText').textContent = message;
      });
  } else {
    document.getElementById('scopeFailText').textContent = '';
    document.getElementById('scopeFailErrorText').textContent =
      'Error: Unable to obtain valid csrf token for this test.';
    console.log('Error: Unable to obtain valid csrf token for this test.');
  }
});

document.getElementById('clearDisplayButton').addEventListener('click', () => {
  document.getElementById('scopeFailText').textContent = '';
  document.getElementById('scopeFailErrorText').textContent = '';
});
