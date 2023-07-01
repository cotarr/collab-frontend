'use strict';
//
// Demo web site collab-frontend
//
// This is common JavaScript that is loaded
// into all the pages to handler the header.
//

// --------------------------
// Event handler for page load
// --------------------------
window.onload = (event) => {
  //
  // Build arrays of page elements to be used in for() loops
  //
  const arrayOfAElements = document.querySelectorAll('.level1-a');
  const arrayOfSpanElements = document.querySelectorAll('.level1-span');
  //
  // CSS style shows "collapsed" attribute is hidden
  //
  const _toggleLevel1Visibility = function (level1Class) {
    if (arrayOfSpanElements.length > 0) {
      for (let i = 0; i < arrayOfSpanElements.length; i++) {
        if (arrayOfSpanElements[i].classList.contains(level1Class)) {
          if (arrayOfSpanElements[i].hasAttribute('collapsed')) {
            arrayOfSpanElements[i].removeAttribute('collapsed');
          } else {
            arrayOfSpanElements[i].setAttribute('collapsed', '');
          }
        }
      } // next i
    }
  };
  const _setLevel1Visibility = function (level1Class) {
    if (arrayOfSpanElements.length > 0) {
      for (let i = 0; i < arrayOfSpanElements.length; i++) {
        if (arrayOfSpanElements[i].classList.contains(level1Class)) {
          arrayOfSpanElements[i].removeAttribute('collapsed');
        }
      } // next i
    }
  };
  // const _hideLevel1Visibility = function (level1Class) {
  //   if (arrayOfSpanElements.length > 0) {
  //     for (let i = 0; i < arrayOfSpanElements.length; i++) {
  //       if (arrayOfSpanElements[i].classList.contains(level1Class)) {
  //         arrayOfSpanElements[i].setAttribute('collapsed', '');
  //       }
  //     } // next i
  //   }
  // };

  const setPanelVisibility = function (newHash) {
    //
    // CSS style shows "selected" attribute highlights in light blue
    //
    document.getElementById('navDropdownDiv').classList.remove('nav-dropdown-div-show');
    if (arrayOfAElements.length > 0) {
      for (let i = 0; i < arrayOfAElements.length; i++) {
        if ((newHash === '') && (arrayOfAElements[i].hash === '#overview')) {
          // Case 1 of 3, no hash, mark overview panel as selected
          arrayOfAElements[i].setAttribute('selected', '');
        } else if (newHash === arrayOfAElements[i].hash) {
          // Case 2 of 3, hash matches <a> tag href, mark as selected
          arrayOfAElements[i].setAttribute('selected', '');
        } else {
          // Case 3 of 3, no match remove selected
          arrayOfAElements[i].removeAttribute('selected');
        }
      }
    }
    //
    // Set panel visibility based on location hash
    //
    document.getElementById('page01SectionOverview').setAttribute('hidden', '');
    document.getElementById('page01SectionTryApi').setAttribute('hidden', '');
    document.getElementById('page01SectionIntrospect').setAttribute('hidden', '');
    document.getElementById('page01SectionUserinfo').setAttribute('hidden', '');
    document.getElementById('page01SectionScopeFail').setAttribute('hidden', '');
    document.getElementById('page01SectionPassword').setAttribute('hidden', '');
    let notFound = true;
    if (newHash === '#overview') {
      document.getElementById('page01SectionOverview').removeAttribute('hidden');
      document.querySelector('title').textContent = 'collab-frontend Overview';
      notFound = false;
    }
    if (newHash === '#tryapi') {
      document.getElementById('page01SectionTryApi').removeAttribute('hidden');
      document.querySelector('title').textContent = 'collab-frontend Try API';
      notFound = false;
    }
    if (newHash === '#introspect') {
      document.getElementById('page01SectionIntrospect').removeAttribute('hidden');
      document.querySelector('title').textContent = 'collab-frontend Introspect';
      notFound = false;
    }
    if (newHash === '#userinfo') {
      document.getElementById('page01SectionUserinfo').removeAttribute('hidden');
      document.querySelector('title').textContent = 'collab-frontend Userinfo';
      notFound = false;
    }
    if (newHash === '#scopefail') {
      document.getElementById('page01SectionScopeFail').removeAttribute('hidden');
      document.querySelector('title').textContent = 'collab-frontend Scope Fail';
      notFound = false;
    }
    if (newHash === '#password') {
      document.getElementById('page01SectionPassword').removeAttribute('hidden');
      document.querySelector('title').textContent = 'collab-frontend Password';
      notFound = false;
    }
    // Hash not found, show overview panel
    if (notFound) {
      console.log('Unrecognized hash in URL, showing over panel as default');
      document.getElementById('page01SectionOverview').removeAttribute('hidden');
      document.querySelector('title').textContent = 'collab-frontend Overview';
    }
    // Scroll to top of page when changing pages.
    window.scrollTo(0, 0);
  }; // setPanelVisibility()

  //
  //
  // toggle User logout/password dropdown menu when button clicked.
  //
  document.getElementById('userDropdownButton').addEventListener('click', function () {
    document.getElementById('userDropdownDiv').classList.toggle('user-dropdown-div-show');
  });

  //
  // toggle navigation dropdown menu when button clicked.
  //
  document.getElementById('navDropdownButton').addEventListener('click', function () {
    document.getElementById('navDropdownDiv').classList.toggle('nav-dropdown-div-show');
    // Normally page01, page02... would be determined logically based on location
    // For purpose of this demo, always expand page01 when opening the menu.
    _setLevel1Visibility('page01');
    if (document.getElementById('navDropdownDiv').classList.contains('nav-dropdown-div-show')) {
      // window.scrollTo(0, 0);
    }
  });

  //
  // Expand or collapse Level 1 menu items when level 0 item is clicked
  //
  document.getElementById('page01Button').addEventListener('click', function () {
    _toggleLevel1Visibility('page01');
  });

  //
  // Detect clicks on scrollable part of page, then hide
  // both user and navigation dropdown menus
  //
  document.getElementById('scrollableDiv').addEventListener('click', function () {
    document.getElementById('navDropdownDiv').classList.remove('nav-dropdown-div-show');
    document.getElementById('userDropdownDiv').classList.remove('user-dropdown-div-show');
  });

  // If the has changes, such as click bookmark
  // Then update highlighting in menu
  // This assumes child web components will parse own window hashchange events
  //
  window.addEventListener('hashchange', function (event) {
    // console.log('hash changed, location:', JSON.stringify(event.target.location, null, 2));
    setPanelVisibility(event.target.location.hash);
  }, false);

  //
  // ON page load set initial visibility
  //
  setPanelVisibility(window.location.hash);

  // -------------------------------------------------
  // When opening the page display the user name
  // in the upper right corner
  //
  // Fetch user information from
  // authorization server /userinfo route.
  // -------------------------------------------------
  setTimeout(() => {
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
    const fetchTimerId = setTimeout(() => fetchController.abort(), 5000);
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
      .then((data) => {
        if (fetchTimerId) clearTimeout(fetchTimerId);
        if ((data) && ('name' in data)) {
          document.getElementById('userDropdownButton').textContent = '> ' + data.name;
        } else {
          document.getElementById('userDropdownButton').textContent = '';
          window.location = '/unauthorized';
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
        // const error = new Error(message);
        console.log(message);
        document.getElementById('userDropdownButton').textContent = '';
        if ((err.status) && ((err.status === 401) || (err.status === 403))) {
          window.location = '/unauthorized';
        } else {
          document.querySelector('body').textContent = message;
        }
      });
  }, 50);
}; // window.onload()
