'use strict';

// --------------------------------------------
// Button event handler for introspect call
// --------------------------------------------
document.getElementById('introspectButton').addEventListener('click', () => {
  const fetchController = new AbortController();
  const fetchURL = '/proxy/oauth/introspect';
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
      if (response.status === 200) {
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
    .then((jsonData) => {
      // console.log(JSON.stringify(json, null, 2));
      if (fetchTimerId) clearTimeout(fetchTimerId);
      document.getElementById('introspectText').textContent = JSON.stringify(jsonData, null, 2);
      document.getElementById('introspectErrorText').textContent = '';
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
      document.getElementById('introspectText').textContent = '';
      document.getElementById('introspectErrorText').textContent = message;
    });
});

// -----------------------------------
// Button handler to clear display data
// -----------------------------------
document.getElementById('clearIntrospectButton').addEventListener('click', () => {
  document.getElementById('introspectText').textContent = '';
  document.getElementById('introspectErrorText').textContent = '';
});

// --------------------------------------------------
// Button click handler, show user info
// --------------------------------------------------
document.getElementById('userinfoButton').addEventListener('click', () => {
  const fetchController = new AbortController();
  const fetchURL = '/userinfo';
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
      if (response.status === 200) {
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
    .then((jsonData) => {
      // console.log(JSON.stringify(json, null, 2));
      if (fetchTimerId) clearTimeout(fetchTimerId);
      document.getElementById('userinfoText').textContent = JSON.stringify(jsonData, null, 2);
      document.getElementById('userinfoErrorText').textContent = '';
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
      document.getElementById('userinfoText').textContent = '';
      document.getElementById('userinfoErrorText').textContent = message;
    });
});

// -----------------------------------
// Button handler to clear display data
// -----------------------------------
document.getElementById('clearUserinfoButton').addEventListener('click', () => {
  document.getElementById('userinfoText').textContent = '';
  document.getElementById('userinfoErrorText').textContent = '';
});
