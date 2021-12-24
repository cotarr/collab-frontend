'use strict';

// --------------------------------------------
// Button event handler for introspect call
// --------------------------------------------
document.getElementById('introspectButton').addEventListener('click', () => {
  const fetchUrl = '/proxy/oauth/introspect';
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
        // On token failure, an OAuth2 API should provide a WWW-Authentication header
        // If WWW-Authentication header is present, append it.
        const wwwAuthenticateHeader = response.headers.get('WWW-Authenticate');
        if (wwwAuthenticateHeader) {
          errorString += ' WWW-Authenticate header: ' + wwwAuthenticateHeader;
        }
        throw new Error(errorString);
      }
    })
    .then((jsonData) => {
      // console.log(JSON.stringify(json, null, 2));
      document.getElementById('introspectText').textContent = JSON.stringify(jsonData, null, 2);
      document.getElementById('introspectErrorText').textContent = '';
    })
    .catch((err) => {
      console.log(err);
      document.getElementById('introspectText').textContent = '';
      document.getElementById('introspectErrorText').textContent = err.message;
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
  const fetchUrl = '/userinfo';
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
        throw new Error('Fetch status ' + response.status + ' ' +
          fetchOptions.method + ' ' + fetchUrl);
      }
    })
    .then((jsonData) => {
      // console.log(JSON.stringify(json, null, 2));
      document.getElementById('userinfoText').textContent = JSON.stringify(jsonData, null, 2);
      document.getElementById('userinfoErrorText').textContent = '';
    })
    .catch((err) => {
      console.log(err);
      document.getElementById('userinfoText').textContent = '';
      document.getElementById('userinfoErrorText').textContent = err.message;
    });
});

// -----------------------------------
// Button handler to clear display data
// -----------------------------------
document.getElementById('clearUserinfoButton').addEventListener('click', () => {
  document.getElementById('userinfoText').textContent = '';
  document.getElementById('userinfoErrorText').textContent = '';
});
