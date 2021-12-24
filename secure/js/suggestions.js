'use strict';
//
// The functions below are used in the submissions.html page
//
// 1) Demonstrate input sanitization.
// 2) Demonstrate use of csrf tokens
// 3) Demonstrate blocking by Content Security Policy (CSP)
// ----------------------------------------------------------------

// ---------------------------------------------
// Event handlers for read data button
// ---------------------------------------------
document.getElementById('getRecordButtonId').addEventListener('click', () => {
  // Id of record to be read in the demonstration (fixed value)
  const databaseRecordId = '435bf533-7280-4dce-a9d0-2960b43019f9';

  const fetchOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  };

  const fetchUrl = '/api/v1/data/manual-data/' + databaseRecordId;

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
      document.getElementById('manualReadText').textContent = JSON.stringify(json, null, 2);
      document.getElementById('manualReadErrorText').textContent = '';
    })
    .catch((err) => {
      console.log(err);
      document.getElementById('manualReadText').textContent = '';
      document.getElementById('manualReadErrorText').textContent = err.message || err.toString();
    });
}); // Event handler for getRecordButtonId button

// ---------------------------------------------
// Event handler patch data button
// ---------------------------------------------
document.getElementById('patchRecordButtonId').addEventListener('click', () => {
  // Extract csrf token from meta tag at top of html page.
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

  // check that csrf token exists and valid, else show error
  if ((!(csrfToken == null)) && (csrfToken.length > 0) && (csrfToken !== '{{csrfToken}}')) {
    // Id of record to be edited in the demonstration (fixed value)
    const databaseRecordId = '435bf533-7280-4dce-a9d0-2960b43019f9';

    // Object to contain mock SQL API submission data
    const data = {
      id: databaseRecordId
    };

    // Add user input string value as current weather (new value for database)
    data.weather = document.getElementById('weatherInputEl').value;

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

    const fetchUrl = '/api/v1/data/manual-data/' + databaseRecordId;

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
        // conso  le.log(JSON.stringify(json, null, 2));
        document.getElementById('manualEditText').textContent =
          'Success, response status=' + json.status.toString() + ' OK';
        document.getElementById('manualEditErrorText').textContent = '';
      })
      .catch((err) => {
        console.log(err);
        document.getElementById('manualEditText').textContent = '';
        document.getElementById('manualEditErrorText').textContent = err.message || err.toString();
      });
  } else {
    document.getElementById('manualEditText').textContent = '';
    document.getElementById('manualEditErrorText').textContent =
      'Error: Unable to obtain valid csrf token for this test.';
  }
}); //  Event handler for patchRecordButtonId button

// ---------------------------------------------
// Event handler:  CSP test button
// ---------------------------------------------
document.getElementById('cspTestButtonId').addEventListener('click', () => {
  // The authorizatoin server URL is a configuration option and can change.
  // The authorization server URL is inserted to the HTML as an attribute to a <span> element.
  // Extract the URL for use as the fetch URL in the CSP demonstration.
  let fetchUrl = null;
  fetchUrl = document.getElementById('cspTestUrlAttr').textContent;

  // Check if URL extraction was successful
  if ((!(fetchUrl == null)) && (fetchUrl.length > 0) && (fetchUrl !== '{{authStatusUrl}}')) {
    // fetchURL is valid and exists
    //
    // --------------------------------
    // Attempt to fetch the status route
    //    from the authorization server.
    //
    // Success response: { status: 'ok }
    // Failure response: Throws error
    // --------------------------------
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
        document.getElementById('cspTestText').textContent = JSON.stringify(json, null, 2);
        document.getElementById('cspTestErrorText').textContent = '';
      })
      .catch((err) => {
        console.log(err);
        document.getElementById('cspTestText').textContent = '';
        document.getElementById('cspTestErrorText').textContent = err.message || err.toString();
      });
  } else {
    document.getElementById('cspTestText').textContent = '';
    document.getElementById('cspTestErrorText').textContent =
      'Error, unable to obtain the URL for this test.';
  }
}); // Event handler for cspTestButtonId button

// -------------------
// Page Load Event
// -------------------
window.addEventListener('load', (event) => {
  // Extract the csrf token from metatag and update page contents, else show error
  let csrfToken = null;
  csrfToken =
    document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  if ((csrfToken == null) || (csrfToken.length === 0) || (csrfToken === '{{csrfToken}}')) {
    console.log('Error: CSRF Token not found in page HTML');
    document.getElementById('manualEditText').textContent = '';
    document.getElementById('manualEditErrorText').textContent =
      'Error: csrf token not found in page HTML';
  } else {
    // document.getElementById('currentCsrfTokenValue').textContent =
    //  '"' + csrfToken + '"';
  }

  // Extract auth server URL from page, verify exists, else show error
  let cspFetchUrl = null;
  cspFetchUrl = document.getElementById('cspTestUrlAttr').textContent;
  if ((cspFetchUrl == null) || (cspFetchUrl.length === 0) ||
    (cspFetchUrl === '{{authStatusUrl}}')) {
    console.log('Error: Authorizaton server URL not found in page HTML');
    document.getElementById('cspTestText').textContent = '';
    document.getElementById('cspTestErrorText').textContent =
      'Error: Authorizaton server URL not found in page HTML';
  };
});
