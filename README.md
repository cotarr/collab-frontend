# colab-frontend

This is a demo repository.
It is a mock web server using passport, passport-oauth2,
and passport-oauth2-middleware to manage OAuth2 bearer tokens
with a reverse proxy to read data from a mock REST API.

This is one of 3 repositories

- collab-auth (Oauth2 Authorization Provider, redirect login, tokens)
- collab-frontend (Mock Web server, reverse proxy, html content)
- collab-backend-api (Mock REST API using tokens to authorize requests)


### Install

```bash
git clone git@github.com:cotarr/collab-frontend.git
cd collab-frontend

npm install

```

### Example Environment variables (showing defaults)

The `.env` file is supported.

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

To start the program
```bash
npm start
```
