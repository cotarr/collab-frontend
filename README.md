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
Alternately, environment variables can be configured as listed in this README.
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
Any unauthorized attempt to view the page will redirect the browser to an
unauthorized landing page with a user login button.
Clicking the [login] button on the landing page will send the web browser to a local /login 
route which will redirect the browser (302) to the authorizaton server.
After successful entry of username and password, the authorization server will redirect
the browser back to the original web site with an authorization code.
This web server will then submit the authorization code to the authorization server and
a valid oauth access token will be returned to the web server where the token is
stored on behalf of the user. The user's session is marked as authorized.
All further requests to download static content will confirm the user's authorized status
before returning the content of static files.

API Access:

It is assumed the mock REST API and the mock IOT device haave been started
and mock data is being submitted to the database,

* The web browser will use it's stored cookie to access the API route on the web server.
* The web server will append a copy of the user oauth2 access token to the HTTP request.
* The web server will forward the request through a reverse proxy to the mock database API.
* The web server uses "/api" as the route prefix for the reverse proxy.
* The URL "http://localhost:3000/api/v1/data/iot-data/" can also be viewed directly at port 3000 using the browser's address bar.
* The web server will remove the "/api" prefix before forwarding the HTTP request through the reverse proxy.
* The database API at "http://localhost:4000/v1/data/iot-data/" checks the access_token and honors the request.

It is not possible to directly access the API on port 4000 using the browser address bar
because the browser does not have an valid oauth access_token.

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

Note that the token's scope is set to "api.write" due to the user role "api.write"
in the user account record, so this user can both read and write to this table in the database.

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
The request scope is hard coded into the frontend web server.

* The web server's client account allowedScope "auth.token" is an auth server permission to allow token issuance on behalf of authenticated users.
* The web server's client account allowedScope "api.read" and "api-write" are possible permissions of tokens issued using the client's ID.
* The user's account role has set "api.write" to control permissions of tokens using the user's ID.
* The token request scope "api.read" and "api.write" can limit the capabilities of the web server to use different proxy or backend connections.

The scope of the access token is the intersection of all three scopes. The desired scope must be present in all three. In this case, tokens issued on behalf of the user will have scope intersection of "api.write". Any requests to the backend API must have a valid token and the token must include scope "api.read" or "api.write" or the request will be rejected.
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

SESSION_SET_ROLLING_COOKIE=false
SESSION_SET_SESSION_COOKIE=false
SESSION_EXPIRE_SEC=604800
SESSION_PRUNE_INTERVAL_SEC=86400
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

Not supported in .env file

```
# When NODE_ENV=production, console activity log disabled.
NODE_ENV=development
# When NODE_DEBUG_LOG=1, console activity log enabled when in production
NODE_DEBUG_LOG=0
```

### Detecting expired user cookie

In this demonstration, expired cookies can be updated by refreshing the page.

Access to the static files such as HTML, CSS and JS are authorized by
the user's cookie that is stored on the collab-frontend web server.
Validation of the cookie is performed by a check() funciton in the web server 
using information stored in the user's session.

When the web server detects an expired cookie, a redirect (302) to /unauthorized
is returned to the web browser. This sends the web browser to an unauthorized
landing page with a [login] button. The login button will
access a local /login route that will redirect (302) the browser the oauth workflow
by sending the browser to /dialog/authorize path on the authorization server.

The request to the /dialog/authorize path on the collab-auth authoriztion server 
will initiate a password entry workflow. Upon successful verification of the 
user's identity by password entry, the authorization server will redirect (302)
the browser back to the collab-frontend web server including an authorization 
code as a query parameter in the redirect URL. Independently from the 
browser, the web server will contact the authorization server directly, and exchange
the authorization code for an access token. After the web server has obtained 
a valid access token, the user's session is marked as authorized.
Future downloads will succeed without error. 

Thus, refreshing the page will initiate actions necessary to refresh the cookie, if needed.

In this example, a successful login will redirect the browser
to the main home page (index.html). It is also possible for the web server to remember
the initial request path, such as /page3.html or /index.html.
The path of the original request can be stored in the user's session.
After password entry, the original request URL can be restored as the page address.
Passport supports this using the successReturnToOrRedirect option.
This has not been implemented in this demonstration.

### Detecting expired access tokens

Expired access tokens may also be replaced by refreshing the page. This works as follows:

In the previous section, an expired cookie was detected by the web server.
In the case of API calls, the expired token is detected locally in the user web browser
by monitoring the response to the /userinfo request.

The web page contains a header bar at the top with a place to display the user's name. 
When the page loads, browser JavaScript performs a GET request to 
the /userinfo route on the web server.
The web server will in turn submit the user's access token to the authorization
server /oauth/introspect route. The user's metadata is returned to the web server.
The user real name is extracted and returned to the web browser's /userinfo request.
The page header is then updated with the user's real name.

In the event where the /userinfo GET request fails with an error,
the browser will execute JavaScript code to set window.location to /unauthorized.
This sends the web browser to an unauthorized landing page with a [login] button.
Clicking the login button will initiate an oauth workflow as described above and a replacement
access token is obtained.

Within the frontend web server, the access token and the token expiration
time are stored in the user's session. The web server check() function will
first compare the access token expiration time to the current system clock.
If the token has expired, the API call will fail (401) which initiates the 
browser redirects described above.

Assuming the access token is not expired, the access token is used by the web
server when the request is forwarded through the reverse proxy to the 
backend API server. If the backend API server fails to successfully validate 
the access token, the API call will fail (401) which initiates the browser
redirects described above.

### Refresh Tokens

This project can be configured to use Oauth 2.0 refresh tokens.
A refresh token can be thought of as a temporary password that can be used
by the web server to obtain replacement access tokens from the authorization server.
Therefore, there are now to methods to for the web server to get an access token.
One way is using the authorization code obtained after user password entry.
The second way is by submitting a refresh token to the authorization server
to request a replacement access token.

In the case where the users access token is expired or otherwise invalid,
the frontend web server will look for a non-expired refresh token.
If found, the web server will submit the refesh token directly to the
authorization server at the /oauth/token route.
The authorization server will verify the refresh token signature and status.
If the refresh token is valid, the authorization server will return a new access token
to the web server with the same scope and user information as the original access token.
The web server will then continue to handle the pending API call using
the replacement access token. In terms of the user experience,
the token replacement is invisible and the page appears to function normally.

In the case where both the access token and the refresh token are expired,
the web server will redirect (302) the web browser to the /unauthorized
landing page. Selection of the login button by the user will return
the web browser to the authorization server for password entry.
Remainder of the login workflow is equivalent to operation without
refresh tokens as described above.

If refresh tokens are enabled on the collab-auth server,
user password entry followed by submission of the access code to the authorization
server will return two tokens in the same reqeust, an access_token and refresh_token.
Both are stored on the user's behalf in the user's session.

Refresh Token Configuration:

There is no configuration necessary in the
collab-frontend web server. When a response from a token request to /oauth/token 
includes a refresh token, it will be stored for use in the user's session.
Refresh tokens must be enabled in the collab-auth authorization server configuration.
By default, refresh tokens are enabled in the default configuration for
demonstration in a protected development environment.

In the collab-auth frontend web server, handing of the access token expiration 
can be set on a per-route basis by passing an options object
to the collab-frontend check() function. If `ignoreToken` is set to true, the 
request will use only the cookie, and honor the request, even if the token
is expired. If `disableRefresh` is set to true, an expired access token
fail without attempting to use the refresh token. 

```js
const auth = require('./auth/auth-check');
const options = {
  redirectURL: '/unauthorized',
  ignoreToken: false,
  disableRefresh: false,
}
app.get('/some-route',
  auth.check(options),
  (req, res, next) {
    res.send('hello world);
  }
);
```

Custom Code:

The passport strategy passport-oauth2 does not include implementation
of automatic token replacement of access tokens using refresh tokens.
In the case of the collab-frontend web server, the original oauth2
workflow involving user password entry, authorization code, and access token
is handled by the passport-oauth2 strategy as configured in the
`server/auth/passport-config.js` file. For compatibililty with 
refresh tokens, the passport callback function will extract 
the access token expiration time and store it in the session 
so it can be used independently to handle refresh tokens.

In order learn about refresh tokens and demonstrate their use, 
a simple JavaScript fetch function was written and included
into the check function of the `auth-check.js` file. 
As a middleware, the check function will then check the token expiration time
that was previously stored in the user's session and fetch a replacement 
token if needed before calling next() on the check middleware.

Disclaimer: Code used in the check function to obtain replacement access tokens
was written for this demo. The code has not been robustly tested.

# Example Security Suggestions

During the course of this project, several security suggestions 
were discovered. Although not part of Oauth 2.0 specifically, 
security weaknesses can compromise sites that use oauth.
The collab-frontend contains a second page at /suggestions.html 
where an example of input sanitization, csrf tokens, and 
content security policy were tried. The examples are explained 
on the page. You may find them intersting.
