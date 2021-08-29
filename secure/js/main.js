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
    // window.location = '/login';
  } else if ((data) && ('name' in data)) {
    document.getElementById('headerName').textContent = data.name;
    document.getElementById('headerLoginButton').setAttribute('hidden', '');
  } else {
    document.getElementById('headerName').textContent = '';
    document.getElementById('headerLoginButton').removeAttribute('hidden');
    // window.location = '/login';
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

// -------------------
// Internal function
// -------------------
const getTestApiData = (endpointUrl) => {
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
      document.getElementById('apiDataText').textContent = JSON.stringify(json, null, 2);
      document.getElementById('apiErrorText').textContent = '';
    })
    .catch((err) => {
      console.log(err);
      document.getElementById('apiDataText').textContent = '';
      document.getElementById('apiErrorText').textContent = err.message;
    });
}; // getTestApiData()

// -------------------------------
// Dummy data for POST request
// -------------------------------
const dummyData = {
  pumpId: 'FA0221',
  status: 'running',
  pumpRpm: 1802,
  suctionPsi: 8.1,
  dischargePsi: 84.1,
  flowGpm: 81.2,
  motorAmps: 27.4,
  motorTempF: 57.4
};

// -------------------
// Internal function
// -------------------
const postTestApiData = (endpointUrl, dataObj) => {
  const fetchUrl = endpointUrl;
  const fetchOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataObj)
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
      document.getElementById('apiDataText').textContent = JSON.stringify(json, null, 2);
      document.getElementById('apiErrorText').textContent = '';
    })
    .catch((err) => {
      console.log(err);
      document.getElementById('apiDataText').textContent = '';
      document.getElementById('apiErrorText').textContent = err.message;
    });
}; // postTestApiData()

// ---------------------------------------------
// Event handlers for buttons, mock API requests
// ---------------------------------------------
document.getElementById('pumpPartsButton').addEventListener('click', () => {
  getTestApiData('/api/v1/data/pumpparts/227');
});
document.getElementById('pumpDataIdButton').addEventListener('click', () => {
  getTestApiData('/api/v1/data/pumpdata/23432');
});
document.getElementById('pumpDataAllButton').addEventListener('click', () => {
  getTestApiData('/api/v1/data/pumpdata');
});

document.getElementById('pumpDataNewButton').addEventListener('click', () => {
  postTestApiData('/api/v1/data/pumpdata', dummyData);
});

document.getElementById('clearDisplayButton').addEventListener('click', () => {
  document.getElementById('apiDataText').textContent = '';
  document.getElementById('apiErrorText').textContent = '';
});
