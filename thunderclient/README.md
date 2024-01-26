# API Test README.md

This README contains instructions for use of the VSCode extension Thunder Client 
to perform an OAuth2 workflow demonstration with the collab-frontend web server.

## Legacy postman collections

The legacy postman collections can be found in the "postman/" folder in commit 
653ce72aa53758c61c2cd8d4274de1466f9a08d8 from 2024-01-25.

## Web server description

The collab-frontend is a demonstration web server. Browser requests are authenticated 
by use of cookie. If the cookie is invalid, the user is redirected (302) to an authorization 
server. 

Browser API requests are sent to the web server to be forwarded to the API using a reverse 
proxy. The web server stores oauth2 access_token on behalf of the user and appends tokens 
to API requests as an Authorization header Bearer token.

## Demo Flowchart

The following flowchart describes each request in the collection. These are: 

Web-1, Web-2, Web-3, Auth-1, Auth-2, Auth-3, Auth-4, Auth-5, Web-4, Web-5

```
        Start
          |
          |    Web-1
    / Main page \
   |   Cookie ?  |
    \ No, fail  /                          Web-2
          |                  / Landing page \
           \----------------| /unauthorized  |
                             \  with link   /
                                   |
                          . . . . . . . . . .     
                          .  User clicks    .
                          . "Login" button  .
                          . . . . . . . . . .                               
                                   |
                                   |   Web -3
                              /  Link   \
        /--------------------| to /login |
        |                     \  route  /
   / Redirect \
  |  to Auth   |
   \  server  /
        |
        | -------------------------- < -----------------------------
        |/                                                          \
        |                                                            |
        |                                                           YES
        |     Auth-1                   Auth-2            Auth-3      |
    /   Is   \                  / Get  \       / Submit \        /        \
   |  cookie  |  -- NO -- > -- |  Login | --> | Password |  --> | Correct? |
    \ valid? /                  \ Form /       \        /        \        /
        |                           |                                |
        |                            \                               NO
       YES                             -------------- < ------------/
        |
        |                              Auth-4             Auth-5
   /    Is    \                 /  Get   \       / User  \
  |   Client   | -- NO -- > -- | Decision | --> | Enters  | -- NO ---\
   \ Trusted? /                 \  Form  /       \ "Yes" /            |
        |                                            |            / Redirect \
       YES                                          YES          |  Error to  |
        |                                            |            \ Browser  /
        | ----------------- < ----------------------/
        |/ 
        |
        |
   / Redirect \
  | With Auth  |
   \  Code    /
        |
        |     Web-4
   /  Submit  \ 
  |  Code to   |
   \ web serv /
        |
        |
   / Redirect \
  |  to main   |
   \  page    /
        |
        |     Web-5
   /   Is    \
  |  Cookie   |
   \ valid?  /
        |
       YES
        |
    Main Page
    Loads...

```

## Required Servers

The following servers must be running in the development environment
for this demo. Each repository has it's own instructions in the README.md file
or in the /docs/ folder of the collab-auth repository.

- collab-auth - authorization server
- collab-frontend - mock web server
- collab-backend-api - mock API server

It is recommended to open the collab-frontend web page 
at http://localhost:3000 using a web browser before performing this demo. 
This will insure all server are running properly in the development environment.

## Import collections from repository

To try the demo, import collection: "thunderclient/thunder-collection_collab-frontend-demo.json" 

- Collection: thunder-collection_collab-frontend-demo.json
  - Included Folder: login-workflow-demo

## Import Environment and create Local Environment

A Thunder Client local environment is required to save authorization codes and access_tokens.
In the Thunder Client "Env" tab, if "(Local Env)" does not show in the list of environments. 
it must be created by selecting "Local Environment" in dropdown.

A set of testing credentials has been included in the repository.
Import the file: "thunderclient/thunder-environment_collab-frontend-env.json".
This will import an environment named "collab-frontend-env".

- After importing the environment, right click and select `Set Active` and a star icon will mark the active environment.

- This includes the following environment variables for use in testing.

```
auth_host:       "http://127.0.0.1:3500"
frontend_host:   "http://localhost:3000"
backend_host:    "http://localhost:4000"
redirect_uri:    "http://localhost:3000/login/callback"
user_username:   "bob"
user_password:   "bobssecret"
client_id:       "abc123"
client_secret:   "ssh-secret"
client_base64:   "YWJjMTIzOnNzaC1zZWNyZXQ="
scopes:          "api.read api.write"
```

Note: auth_host URL must be a different hostname from 
frontend_host URL for cookies to operate properly.
For the demo "localhost" and "127.0.0.1" are used. They are different.

## Rate limit issues

You may run into a problem with the  network rate limit middleware.
Exceeding the rate limit will generate status 429 Too Many Request 
errors. Restarting the server will reset the limit.
It can be set to a higher value in the environment variables if needed.

# Running the collab-frontend demo

Collection: collab-frontend-demo
Collection Folder: login-workflow-demo

The API test conditions are written for the case of an untrusted client 
`{ "trustedClient": false }` configured in the collab-auth client database.
In this configuration, the decision form (Auth-4) and submission of 
users decision to allow resource (Auth-5) are included (see flowchart above)

The recommended way to explore the authorization code grant collection is to 
single step the collection. At each step, look at the URL query parameters (GET)
or body parameters (POST) being submitted in the request. In the response, look at the 
HTTP status code, location header, and the response body.


