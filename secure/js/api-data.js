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
      if ((Array.isArray(json)) && (json.length === 0)) {
        document.getElementById('apiErrorText').textContent =
          '[ ] indicates an empty array. ' +
          'It is likely the emulated IOT device has not submitted any data.';
      } else {
        document.getElementById('apiErrorText').textContent = '';
      }
    })
    .catch((err) => {
      console.log(err);
      document.getElementById('apiDataText').textContent = '';
      document.getElementById('apiErrorText').textContent = err.message;
    });
}; // getTestApiData()

// ---------------------------------------------
// Event handlers for buttons, mock API requests
// ---------------------------------------------
document.getElementById('iotDataButton').addEventListener('click', () => {
  getTestApiData('/api/v1/data/iot-data/');
});

document.getElementById('clearDisplayButton').addEventListener('click', () => {
  document.getElementById('apiDataText').textContent = '';
  document.getElementById('apiErrorText').textContent = '';
});