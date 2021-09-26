# colab-frontend

This is 2 of 4 repositories used on a collaboration project for learning oauth2orize and passport.
This repository is a mock web server using passport strategy passport-oauth2
and middleware passport-oauth2-middleware.
The web server emulates a personal web page that would require user authentication to view the page
and gain access to data in home network IOT devices.
Unauthorized users are redirected to the oauth2 server for user login.
After login, the web server stores the user's oauth2 access_token used to obtain access to a mock SQL database.
The web server includes a reverse proxy to redirect requests to the mock REST API.


|                        Repository                                  |                   Description                         |
| ------------------------------------------------------------------ | ----------------------------------------------------- |
| collab-auth                                                        | Oauth2 Authorization Provider, redirect login, tokens |
| [collab-frontend](https://github.com/cotarr/collab-frontend)       | Mock Web server, reverse proxy, HTML content          |
| [collab-backend-api](https://github.com/cotarr/collab-backend-api) | Mock REST API using tokens to authorize requests      |
| [collab-iot-device](https://github.com/cotarr/collab-iot-device)   | Mock IOT Device with data acquisition saved to DB     |


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


All files on this website are protected.
No website files will load until the user successfully provides a username and password.
Any unauthorized attempt to view the page will redirect the browser to the
oauth2 authorization server. After successful entry of username and password,
the browser will be automatically redirected back to the original web site.

[http://localhost:3000](http://localhost:3000)

It is assumed the mock IOT device has been started and has been submitting mock data to the database,
The web browser will use it's stored cookie to access the proper route on the web server.
The web server will append a copy of the user oauth2 access token to the HTTP request.
The web server will forward the request through a reverse proxy to the mock database API.
The web server uses "/api" as the route prefix for the reverse proxy.
The URL "http://localhost:3000/api/v1/data/iot-data/" can also be viewed directly at port 3000 using the browser's address bar.
The web server will remove the "/api" prefix before forwarding the HTTP request through the reverse proxy.
The database API at "http://localhost:4000/v1/data/iot-data/" checks the access_token and honors the request.
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

### Example Environment variables (showing defaults)

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

SESSION_DISABLE_MEMORYSTORE=false
SESSION_EXPIRE_SEC=604800
SESSION_SECRET="Change Me"

OAUTH2_CLIENT_ID=abc123
OAUTH2_CLIENT_SECRET=ssh-secret
OAUTH2_MAIN_URL=http://localhost:3000
OAUTH2_AUTH_URL=http://127.0.0.1:3500
OAUTH2_REQUESTED_SCOPE='["api.read","api.write"]'

REMOTE_API_URL=http://localhost:4000
```
