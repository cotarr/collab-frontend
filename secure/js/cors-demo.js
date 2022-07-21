'use strict';

//
// Common network fetch
//
const corsFetch = (fetchUrl, method) => {
  const fetchOptions = {
    method: method,
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
      document.getElementById('corsTestText').textContent = JSON.stringify(json, null, 2);
      document.getElementById('corsTestErrorText').textContent = '';
    })
    .catch((err) => {
      console.log(err);
      document.getElementById('corsTestText').textContent = '';
      document.getElementById('corsTestErrorText').textContent = err.message || err.toString();
    });
};

// ---------------------------------------------
// CORS/CSP (Content security policy fail)
// ---------------------------------------------
document.getElementById('corsCspTestButtonId').addEventListener('click', () => {
  let fetchUrl = null;
  fetchUrl = document.getElementById('corsCspTestUrlAttr').textContent;

  // Check if URL extraction was successful
  if ((!(fetchUrl == null)) && (fetchUrl.length > 0) && (fetchUrl !== '{{authStatusUrl}}')) {
    corsFetch(fetchUrl, 'GET');
  } else {
    document.getElementById('corsTestText').textContent = '';
    document.getElementById('corsTestErrorText').textContent =
      'Error, unable to obtain the URL for this test.';
  }
}); // Event handler for cspTestButtonId button

// CORS 1
document.getElementById('corsTest1ButtonId').addEventListener('click', () => {
  let fetchUrl = null;
  fetchUrl = document.getElementById('corsTestUrl1Attr').textContent;

  // Check if URL extraction was successful
  if ((!(fetchUrl == null)) && (fetchUrl.length > 0) && (fetchUrl !== '{{apiStatusUrl}}')) {
    corsFetch(fetchUrl, 'GET');
  } else {
    document.getElementById('corsTestText').textContent = '';
    document.getElementById('corsTestErrorText').textContent =
      'Error, unable to obtain the URL for this test.';
  }
}); // CORS 1

// CORS 2a
document.getElementById('corsTest2aButtonId').addEventListener('click', () => {
  let fetchUrl = null;
  fetchUrl = document.getElementById('corsTestUrl2aAttr').textContent;

  // Check if URL extraction was successful
  if ((!(fetchUrl == null)) && (fetchUrl.length > 0) && (fetchUrl !== '{{apiCors2aUrl}}')) {
    corsFetch(fetchUrl, 'GET');
  } else {
    document.getElementById('corsTestText').textContent = '';
    document.getElementById('corsTestErrorText').textContent =
      'Error, unable to obtain the URL for this test.';
  }
}); // CORS 2a

// CORS 2b
document.getElementById('corsTest2bButtonId').addEventListener('click', () => {
  let fetchUrl = null;
  fetchUrl = document.getElementById('corsTestUrl2bAttr').textContent;

  // Check if URL extraction was successful
  if ((!(fetchUrl == null)) && (fetchUrl.length > 0) && (fetchUrl !== '{{apiCors2bUrl}}')) {
    corsFetch(fetchUrl, 'DELETE');
  } else {
    document.getElementById('corsTestText').textContent = '';
    document.getElementById('corsTestErrorText').textContent =
      'Error, unable to obtain the URL for this test.';
  }
}); // CORS 2a

// CORS 3A
document.getElementById('corsTest3aButtonId').addEventListener('click', () => {
  let fetchUrl = null;
  fetchUrl = document.getElementById('corsTestUrl3aAttr').textContent;

  // Check if URL extraction was successful
  if ((!(fetchUrl == null)) && (fetchUrl.length > 0) && (fetchUrl !== '{{apiCors3aUrl}}')) {
    corsFetch(fetchUrl, 'GET');
  } else {
    document.getElementById('corsTestText').textContent = '';
    document.getElementById('corsTestErrorText').textContent =
      'Error, unable to obtain the URL for this test.';
  }
}); // CORS 3a
// CORS 3b
document.getElementById('corsTest3bButtonId').addEventListener('click', () => {
  let fetchUrl = null;
  fetchUrl = document.getElementById('corsTestUrl3bAttr').textContent;

  // Check if URL extraction was successful
  if ((!(fetchUrl == null)) && (fetchUrl.length > 0) && (fetchUrl !== '{{apiCors3bUrl}}')) {
    corsFetch(fetchUrl, 'DELETE');
  } else {
    document.getElementById('corsTestText').textContent = '';
    document.getElementById('corsTestErrorText').textContent =
      'Error, unable to obtain the URL for this test.';
  }
}); // CORS 3b

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
    document.getElementById('corsTestText').textContent = '';
    document.getElementById('corsTestErrorText').textContent =
      'Error: csrf token not found in page HTML';
  } else {
    // document.getElementById('currentCsrfTokenValue').textContent =
    //  '"' + csrfToken + '"';
  }
});
