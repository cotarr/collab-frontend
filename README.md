# colab-frontend

This is a demo repository.
It is a mock web server using passport, passport-oauth2,
and passport-oauth2-middleware to manage OAuth2 bearer tokens
with a reverse proxy to read data from a mock REST API.
It is intended for use in demonstration of repository collab-auth.

This is one of 4 repositories

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
Alternately, environment variables can be configured as listed at the end of this README

```bash
npm start
```

### To load the web page.

* All three repositories must be started to use this demo.


All files on this website are protected.
No website files will load until the user successfully provides a username and password.
Any unauthorized attempt to view the page will redirect the browser to the
oauth2 authorization server. After successful entry of username and password,
the browser will be automatically redirected back to the original web site.

[http://localhost:3000](http://localhost:3000)

### Example Environment variables (showing defaults)

The `.env` file is supported using `dotenv`

```
SITE_VHOST=*
SITE_SECURITY_CONTACT=security@example.com
SITE_SECURITY_EXPIRES="Fri, 1 Apr 2022 08:00:00 -0600"

SERVER_TLS_KEY=./server/certs/privatekey.pem
SERVER_TLS_CERT=./server/certs/certificate.pem
SERVER_TLS=false
SERVER_PORT=3000
SERVER_PID_FILENAME=

SESSION_DISABLE_MEMORYSTORE=false
SESSION_EXPIRE_SEC=86400
SESSION_SECRET="Change Me"

OAUTH2_CLIENT_ID=abc123
OAUTH2_CLIENT_SECRET=ssh-secret
OAUTH2_MAIN_URL=http://localhost:3000
OAUTH2_AUTH_URL=http://127.0.0.1:3500

REMOTE_API_URL=http://localhost:4000
```
