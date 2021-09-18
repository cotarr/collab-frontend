'use strict';

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
    .then((json) => {
      // console.log(JSON.stringify(json, null, 2));
      callback(null, json);
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    });
}; // showLoginStatus()

// --------------------------------------------------
// Button click handler, check login status
// --------------------------------------------------
document.getElementById('userinfoButton').addEventListener('click', () => {
  // --------------------------------------------------------
  // Callback function to show response data or error on page
  // --------------------------------------------------------
  const callback = (err, data) => {
    if (err) {
      document.getElementById('userinfoText').textContent = '';
      document.getElementById('userinfoErrorText').textContent = err.message;
    } else {
      document.getElementById('userinfoText').textContent = JSON.stringify(data, null, 2);
      document.getElementById('userinfoErrorText').textContent = '';
    }
  };
  fetchUserInfo(callback);
});

// ---------------------------------------------------
// Callback function to update page header with username
// ---------------------------------------------------
const loadCallback = (err, data) => {
  if (err) {
    document.getElementById('headerName').textContent = '';
    document.getElementById('headerLoginButton').removeAttribute('hidden');
    window.location = '/login';
  } else if ((data) && ('name' in data)) {
    document.getElementById('headerName').textContent = data.name;
    document.getElementById('headerLoginButton').setAttribute('hidden', '');
  } else {
    document.getElementById('headerName').textContent = '';
    document.getElementById('headerLoginButton').removeAttribute('hidden');
    window.location = '/login';
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

// -------------------
// Internal function
// -------------------
const fetchTokenInfo = (callback) => {
  const fetchUrl = '/proxy/oauth/introspect';
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
    .then((json) => {
      // console.log(JSON.stringify(json, null, 2));
      callback(null, json);
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    });
}; // showLoginStatus()

// --------------------------------------------
// Button event handler for introspect call
// --------------------------------------------
document.getElementById('introspectButton').addEventListener('click', () => {
  const callback = (err, data) => {
    if (err) {
      document.getElementById('introspectText').textContent = '';
      document.getElementById('introspectErrorText').textContent = err.message;
    } else {
      document.getElementById('introspectText').textContent = JSON.stringify(data, null, 2);
      document.getElementById('introspectErrorText').textContent = '';
    }
  };
  fetchTokenInfo(callback);
});

//
// Show or hide IOT panels
//
document.getElementById('iotDescriptionButton1').addEventListener('click', () => {
  if (document.getElementById('iotDescriptionDiv').hasAttribute('hidden')) {
    document.getElementById('iotDescriptionDiv').removeAttribute('hidden');
    document.getElementById('iotDescriptionButton1').textContent = 'Hide IOT Description';
  } else {
    document.getElementById('iotDescriptionDiv').setAttribute('hidden', '');
    document.getElementById('iotDescriptionButton1').textContent = 'Show IOT Description';
  }
});

document.getElementById('iotDescriptionButton2').addEventListener('click', () => {
  document.getElementById('iotDescriptionDiv').setAttribute('hidden', '');
  document.getElementById('iotDescriptionButton1').textContent = 'Show IOT Description';
});
//
// Show or hide API panels
document.getElementById('apiDescriptionButton1').addEventListener('click', () => {
  if (document.getElementById('apiDescriptionDiv').hasAttribute('hidden')) {
    document.getElementById('apiDescriptionDiv').removeAttribute('hidden');
    document.getElementById('apiDescriptionButton1').textContent = 'Hide API Description';
  } else {
    document.getElementById('apiDescriptionDiv').setAttribute('hidden', '');
    document.getElementById('apiDescriptionButton1').textContent = 'Show APIDescription';
  }
});

document.getElementById('apiDescriptionButton2').addEventListener('click', () => {
  document.getElementById('apiDescriptionDiv').setAttribute('hidden', '');
  document.getElementById('apiDescriptionButton1').textContent = 'Show API Description';
});
