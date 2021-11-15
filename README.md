# colab-frontend

This is 2 of 4 repositories.
This repository is a mock web server using the npm [passport](https://www.npmjs.com/package/passport)
package with passport-oauth2 passport strategy to implement oauth2 to restrict access to the web page.
The web server emulates a personal web page that would require user authentication to view the page
and gain access to data in home network IOT devices.
Unauthorized users are redirected to the oauth2 server for user login.
After login, the web server stores the user's oauth2 access_token used to obtain access to a mock SQL database.
The web server includes a reverse proxy to redirect requests to the mock REST API.

|                        Repository                                  |                   Description                         |
| ------------------------------------------------------------------ | ----------------------------------------------------- |
| [collab-auth](https://github.com/cotarr/collab-auth)               | Oauth2 Authorization Provider, redirect login, tokens |
| [collab-frontend](https://github.com/cotarr/collab-frontend)       | Mock Web server, reverse proxy, HTML content          |
| [collab-backend-api](https://github.com/cotarr/collab-backend-api) | Mock REST API using tokens to authorize requests      |
| [collab-iot-device](https://github.com/cotarr/collab-iot-device)   | Mock IOT Device with data acquisition saved to DB     |


### Documentation:

https://cotarr.github.io/collab-auth

### Install

```bash
git clone git@github.com:cotarr/collab-frontend.git
cd collab-frontend

npm install

```

### To start the program

In the development environment with NODE_ENV=development or NODE_ENV not specified,
the application should run as-is. No configuration is necessary in development mode.
Alternately, environment variables can be configured as listed at the end of this README.
In the default configuration the server will listen on port 3000 at http://localhost:3000.

```bash
npm start
```

### To load the web page.

* All 4 repositories must be started to use this demo.

* Web server URL: [http://localhost:3000](http://localhost:3000)

Static Content:

This is intended to emulate a private web site. All files on this website are access restricted.
No website files will load until the user successfully provides a username and password.
Any unauthorized attempt to view the page will redirect the browser to the
oauth2 authorization server. After successful entry of username and password,
the browser will be automatically redirected back to the original web site with an authorization code.
This web server will submit the authorization code to the authorization server and
a valid oauth access token will be returned to the web server where the token is
stored on behalf of the user. The user's session is marked as authorized.
All further requests to download static content will confirm the user's authorized status
before returning the content of static files.

API Access:

It is assumed the mock REST API and the mock IOT device haave been started
and mock data is being submitted to the database,

* The web browser will use it's stored cookie to access the proper route on the web server.
* The web server will append a copy of the user oauth2 access token to the HTTP request.
* The web server will forward the request through a reverse proxy to the mock database API.
* The web server uses "/api" as the route prefix for the reverse proxy.
* The URL "http://localhost:3000/api/v1/data/iot-data/" can also be viewed directly at port 3000 using the browser's address bar.
* The web server will remove the "/api" prefix before forwarding the HTTP request through the reverse proxy.
* The database API at "http://localhost:4000/v1/data/iot-data/" checks the access_token and honors the request.

It is not possible to directly access the API on port 4000 using the browser address bar
because the browser does not have an access_token.

If the database is running and contains mock data, records can be viewed using a button on the page.
The data consists of an array of objects in JSON format. If the array is empty, it will be
displayed as `[ ]`. The array is limited to a maximum of 10 elements, and the most recent 10
timestamped data points from the mock IOT device should be available in the array.

```
[
  {
    "id": 1277,
    "deviceId": "iot-device-12",
    "timestamp": "2021-09-17T15:32:08.417Z",
    "data1": 24.831,
    "data2": 27.241,
    "data3": 22.307
    "updatedAt": "2021-09-17T15:33:07.797Z",
    "createdAt": "2021-09-17T15:33:07.797Z"
  }
]
```

For demonstration purposes, there is a test API on the web server that will display the
token validation results for the currently stored user access_token. This functionality is not
normally available to the user. It is used by resource servers, such as the database API,
to confirm validity of a user's token before honoring the HTTP request.

Note that the token's scope is limited to "api.read" due to the user role "api.read"
in the user account record, so this user can read but not write to this table in the database.

To consider the token to be valid, the application should check for both status 200 in the
http request and the property `active === true` in the body of the response.

```
{
  "active": true,
  "revocable": true,
  "issuer": "http://127.0.0.1:3500/oauth/token",
  "jti": "738e8ca1-25f2-477f-b6bb-a9624cafdc36",
  "sub": "a7b06a6d-7538-45c8-bb5f-b107a8258c7d",
  "exp": 1632057883,
  "iat": 1632054283,
  "grant_type": "authorization_code",
  "expires_in": 3558,
  "auth_time": 1632054283,
  "scope": [
    "api.read"
  ],
  "client": {
    "id": "dd2e3a2e-b7a0-4eeb-9325-bbb0f69be1f5",
    "clientId": "abc123",
    "name": "collab-frontend"
  },
  "user": {
    "id": "a7b06a6d-7538-45c8-bb5f-b107a8258c7d",
    "number": 1,
    "username": "bob",
    "name": "Bob Smith"
  }
}
```

There is a button that can be used to view user account information for the
currently logged in user. This is intended for internal use by the browser JavaScript to
display the user's name in the header bar or other location.

```
{
  "id": "a7b06a6d-7538-45c8-bb5f-b107a8258c7d",
  "number": 1,
  "username": "bob",
  "name": "Bob Smith",
  "scope": [
    "api.read"
  ]
}
```

### Scope values

There are three scope value that are relevant to this example:

* The user account scope referred to as "role"
* The web server client account scope referred to as "allowedScope"
* The web server token request scope used as a "scope" query parameter.

The user role and client allowedScope are set in the authorization server.
The only scope relevant to this web server module is the token request scope.
The default value is `'["api.read", "api.write"]')`.
This can be customized using the OAUTH2_REQUESTED_SCOPE environment variable

* The web server's client account allowedScope "auth.token" is an auth server permission to allow token issuance on behalf of authenticated users.
* The web server's client account allowedScope "api.read" and "api-write" are possible permissions of tokens issued using the client's ID.
* The user's account role requires "api.read" to control permissions of tokens using the user's ID.
* The token request scope "api.read" and "api.write" relate to capabilities of the server software reverse proxy.

The scope of the access token is the intersection of all three scopes. The desired scope my be present in all three. In this case, tokens issued on behalf of the user will have scope intersection of "api.read". Any requests to the backend API must have a valid token and the token must include scope "api.read" or the request will be rejected.
Invalid tokens will reject with status 401 Authorized. Insufficient scope will reject with status 403 Forbidden.

### Example Environment variables

The `.env` file is supported using dotenv npm package

```
SITE_VHOST=*
SITE_SECURITY_CONTACT=security@example.com
SITE_SECURITY_EXPIRES="Fri, 1 Apr 2022 08:00:00 -0600"

SERVER_TLS_KEY=
SERVER_TLS_CERT=
SERVER_TLS=false
SERVER_PORT=3000
SERVER_PID_FILENAME=

SESSION_EXPIRE_SEC=604800
SESSION_SECRET="Change Me"
SESSION_ENABLE_REDIS=false
SESSION_REDIS_PREFIX="session:"
SESSION_REDIS_PASSWORD=""

OAUTH2_CLIENT_ID=abc123
OAUTH2_CLIENT_SECRET=ssh-secret
OAUTH2_MAIN_URL=http://localhost:3000
OAUTH2_AUTH_URL=http://127.0.0.1:3500
OAUTH2_REQUESTED_SCOPE='["api.read","api.write"]'

REMOTE_API_URL=http://localhost:4000
```

### Replacing expired user cookie

In this demonstration, expired cookies can be updated by refreshing the page.

Access to the static files such as HTML, CSS and JS are authorized by
the user's cookie that is stored on the web server.
Validation of the cookie is performed by the web server by
comparing the cookie ID to a value stored in the users session.

When the web server detects an expired cookie, a redirect (302) to /login
is returned to the web browser. This initiates the oauth workflow
by sending the browser to /dialog/authorize path on the authorization server.

The user's browser can store two cookies, one for the web page, and a
second cookie for the authorization server login page.
In the case where the web page cookie is expired or deleted
the authorization server redirect can be handled in two different ways.
If the user's second cookie for the authorization server is still valid,
the request to the /dialog/authorize path will immediately return
a new authorization code without prompting for a password.
In the case where both cookies are expired, password entry is required.

After the web server has completed the oauth handshake process,
the user's session is marked as authorized and future downloads
will succeed without error. Thus, refreshing the page will renew
an expired cookie.

In this example, the login redirect will always redirect the browser
to the main home page. It is possible for the web server to remember
the initial request path, such as /page3.html or /index.html.
The path of the original request can be stored in the user's session
to restore the original request URL after password entry.
Passport supports this using the successReturnToOrRedirect option.
This has not been implemented in this demonstration.

### Replacing expired access tokens

In the case of the default configuration, expired access tokens may
be replaced by refreshing the page. This works as follows:

Expired tokens can be detected on the main web page.
Third party database requests pass through the web server using a reverse proxy.
The web server appends the access token to all reverse proxy server requests.
The web server appends the token without validation of token status.
Validation is performed by the mock REST API also known as resource server.
In the case where the access token is expired, the API reverse proxy
request will return an error to the browser.
When viewing the main web page, activating the API display button will
show an error on the web page due to the expired token.

In the previous section, an expired cookie was detected by the web server.
In the case of API calls, the expired token is detected locally in the user web browser
by monitoring the response to the /userinfo request.

The web page contains a header bar at the top. The page contains javascript code that
performs a GET request to the /userinfo route on the web server.
The web server will in turn submit the user's access token to the authorization
server /oauth/introspect route. The user's metadata is returned to the web server.
The user real name is extracted and returned to the web browser.
The page header is then updated with the user's real name.
In the event where the /userinfo GET request fails with an error,
the browser will execute javascript code to set window.location to /login.
This will initiate an oauth workflow as described above and a replacement
access token is obtained.

In the case where the user's web browser has a valid cookie for the
authorization server login page, the password form is not required.
The oauth redirects are immediate.
To the user, refreshing the page restores access to the API.

In the case where where the users cookie for the authorization server is
expired, a password form will be presented to the user as part of the workflow.

In summary, by properly managing the expiration time of the cookies and tokens
persistent login can be maintained. New tokens are replaced automatically
during page load or page refresh as needed.
