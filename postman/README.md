# Postman collections

## Web server description

The collab-frontend is a demonstration web server. Browser requests are authenticated 
by use of cookie. If the cookie is invalid, the user is redirected (302) to an authorization 
server. 

Browser API requests are sent to the web server to be forwarded to the API using a reverse 
proxy. The web server stores oauth2 access_token on behalf of the user and appends tokens 
to API requests as an Authorization header Bearer token.

## Import postman collections

- Import "postman/collab-frontend.postman_collection.json" collection from repository
- Import "postman/"collab-frontend.postman_environment.json" enviornment from repository

## Local variables

Note: auth_host URL must be a different hostname from other URL for cookies to operate properly

The development version listed below can be imported directly into postman from "collab-frontend.postman_environment.json"

- auth_host      (http://127.0.0.1:3500)
  frontend_host  (http://localhost:3000)
- backend_host   (http://localhost:4000)
- redirect_uri   (http://localhost:3000/login/callback)
- user_username  (bob)
- user_password  (bobssecret)
- client_id      (abc123)
- client_secret  (ssh-secret)
- client_base64  (YWJjMTIzOnNzaC1zZWNyZXQ=)

## Required Servers

The following servers must be running in the development environment
for these test.

- collab-auth - authorization server
- collab-frontend - mock web server
- collab-backend-api - mock API server

## Rate Limiter Issues

Repeated testing may encounter status 429 (Too Many Requests) 
from the collab-auth authorization server. 
The rate limiters may be reset by restarting the authorization server.

## Collection "collab-frontend"

The authorization method should have been preset after importing the collection.

- Select Collection, then select collection Authorization tab
- The Type should be set to "No Auth". The rest of the tab is blank.


# Operation

The tests can be run individually or as Run Collection. If they are run individually, they must be run in the proper order.
