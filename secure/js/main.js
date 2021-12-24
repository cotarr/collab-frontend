'use strict';
//
// Demo web site - JavaScript controller
//
// This is common JavaScript that is loaded
// into all the pages to handler the header.
//

// --------------------------
// Event handler for page load
// --------------------------
window.onload = (event) => {
  // -------------------------------------------------
  // Fetch header bar with user information from
  // authorization server /userinfo route.
  // Returns promise
  // -------------------------------------------------
  setTimeout(() => {
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
      .then((data) => {
        if ((data) && ('name' in data)) {
          document.getElementById('headerName').textContent = data.name;
        } else {
          document.getElementById('headerName').textContent = '';
          window.location = '/unauthorized';
        }
      })
      .catch((err) => {
        console.log(err.message || err);
        document.getElementById('headerName').textContent = '';
        window.location = '/unauthorized';
      });
  }, 250);
};
