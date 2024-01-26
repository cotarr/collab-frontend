# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## v1.0.3-Dev

The Postman desktop client has deprecated the scratch pad feature.
It is no longer possible to operate Postman using local files.

The VSCode extension Thunder Client was selected as a replacement.
The postman collections have been converted to Thunder Client format.
Instructions for the new collections are in thunderclient/README.md

The legacy postman collections can be found in the "postman/" folder in commit 
653ce72aa53758c61c2cd8d4274de1466f9a08d8 from 2024-01-25.

## [v1.0.2](https://github.com/cotarr/collab-frontend/releases/tag/v1.0.2) 2024-01-25

### Added

The OAuth 2.0 login process uses the modules: passport, passport-oauth2, 
express-session, memorystore and connect-redis to manage cookies, sessions 
and the associated session store database. In certain configurations, 
it was possible for the session expiration time to be updated (touched) 
with each request. In certain configurations, this could allow a cookie 
to be treated as a rolling cookie even if configured for 
SESSION_SET_ROLLING_COOKIE=false. This was addressed by adding an explicit 
user login timestamp and session expiration check that is independent of 
the session store touch and prune functions. In the case of 
SESSION_SET_ROLLING_COOKIE=true, the new expiration check is disabled.

- server/auth/passport-config.js - At user login, add user's login timestamp to session, done in passport OAuth2Strategy callback function
- server/auth/auth-check.js - Added check for expired session
- server/app.js - Update express-session configuration for connect-redis and memorystore 
- server/config/index.js - Removed configuration variable SESSION_SET_SESSION_COOKIE
- Updated README.md and example.env to remove SESSION_SET_SESSION_COOKIE

- Update all npm dependencies

## [v1.0.1](https://github.com/cotarr/collab-frontend/releases/tag/v1.0.1) 2023-11-04

Updated the passport configuration object by adding `state=true`.
This configuration change will cause the passport middleware to 
include a random nonce in the authorization code grant workflow
to address CSRF risks during 302 redirects.

Update codeql-analysis.yml to increment upgrade to CodeQL Action v2 for 
github code scanning.

## [v1.0.0](https://github.com/cotarr/collab-frontend/releases/tag/v1.0.0) 2023-07-08

This edit started as a dependency update driven by GitHub dependabot dependency warning.
During the editing, this evolved into a general code clean up of the repository.

### BREAKING CHANGE - Node>=18

- Increment major from 0 to 1 to reflect breaking change with node>=18
- Add node version check to server/config/index.js
- Add engines.node = ">=18" in package.json
- Uninstall node-fetch v2 as a dependency. NodeJs native fetch() API will be used.

### Browser HTML/JS changes

- A new dropdown navigation menu was added to the top left, and the page was divided in sections for each menu item.
- A new dropdown menu was added to the top right for user logout and password change.
- Added a new section to demonstrate use of scope values to restrict access to a resource.
- Updated some of the descriptions on the page.
- For the http fetch requests, timers were added, and upon status errors, the content of the error message is downloaded from web server.
- Removed page with security suggestions. These are out of date and have no relation to oauth2 demo project.
- Removed postman tests for security suggestion API, since they are no longer on the page.

### Web server changes

- Install npm rotating-file-stream and configure for log file rotation
- Delete package-lock.json and regenerate V3 package-lock.json. 
- Edit package-lock.json to force semver@7.5.3, then run npm audit fix to clear audit warnings.
- Re-install eslint to current version and fix new linting errors
- Dependency updates @dr.pogodin/csurf@1.13.0, dotenv@16.3.1, node-fetch@2.6.12, passport-oauth2@1.7.0
- For security headers, upgrade helmet@7.0.0 and edit app.js for helmet options to match current version.
- For redis session store, upgrade redis@4.6.7, connect-redis@7.1.0 and edit app.js to fix breaking changes in connect-redis.
- Removed handling of routes for security suggestions from app.js to match web browser changes.

## [v0.0.10](https://github.com/cotarr/collab-frontend/releases/tag/v0.0.10) 2023-01-11

### Changed

The npm security advisory for debug package has been updated to 
to incorporate backport debug@2.6.9 as safe. Manual edit of package-lock.json is 
no longer required.

- Deleted package-lock.json. Ran npm install to create a new package-lock.json.

## [v0.0.9](https://github.com/cotarr/collab-frontend/releases/tag/v0.0.9) 2023-01-11

### Changed

To fix npm audit warning:

- Deleted package-lock.json, re-installed eslint and dependencies.
- package-lock.json - Manually upgrade all instances of debug<=3.1.0 to debug@4.3.4
- eslintrc.js - update rules to match changes in eslint upgrade.

## [v0.0.8](https://github.com/cotarr/collab-frontend/releases/tag/v0.0.8) 2023-01-01

### Changed

Replaced deprecated package `csurf` with forked repository `@dr.pogodin/csurf`. 
This package is used to validate CSRF tokens included with POST requests to 
reduce risk of cross site request forgery attempts. 

The forked version is a direct replacement for csurf@1.11.0. No code changes were required.

Npm dependency update: express@4.18.2

## [v0.0.7](https://github.com/cotarr/collab-frontend/releases/tag/v0.0.7) 2022-11-15

### Changed

- package-lock.json - Bumped minimatach v3.0.4 to v3.1.2, npm audit fix to address github dependabot alert.

## [v0.0.6](https://github.com/cotarr/collab-frontend/releases/tag/v0.0.6) 2022-07-12

### Changed

- package.json - Bumped passport from v0.5.2 to v0.6.0 to address github dependabot security advisory realted to session fixation attack.
- server/auth/logout.js - Added callback function to req.logout() to support required breaking change in passport v0.6.0

### Changed
- Update express 4.17.3 to 4.18.1, express-session from 1.17.2 to 1.17.3, dotenv from 16.0.0 to 16.0.1, helmet 5.0.2 to 5.1.0

## [v0.0.5](https://github.com/cotarr/collab-frontend/releases/tag/v0.0.5) - 2022-03-31

### Changed

- package.json - Update connect-redis@6.1.3, dotenv@16.0.0, express@4.17.3, --save helmet@5.0.2, memorystore@1.6.7 (No code changes)

## [v0.0.4](https://github.com/cotarr/collab-frontend/releases/tag/v0.0.4) - 2022-03-30

### Changed

- npm audit fix - bump mimimist 1.2.5 to 1.2.6 to address github dependabot security advisory for prototype pollution.

## [v0.0.3](https://github.com/cotarr/collab-frontend/releases/tag/v0.0.3) - 2022-01-22

### Changed

- Update node-fetch to 2.6.7 to address github audit advisory
- Update express to 4.17.2
- app.js update comments for helmet v5.0.1 (no code change) 2022-01-08

## [v0.0.2](https://github.com/cotarr/collab-frontend/releases/tag/v0.0.2) - 2022-01-05

### Changed
- Update comments in javascript files (no code changes)
- Passport update minor version
- Helmet version 4 to version 5
- Update postman collection 2021-12-28
- Added github CodeQL scanning 2021-12-29

## [v0.0.1](https://github.com/cotarr/collab-frontend/releases/tag/v0.0.1) - 2021-12-26

### Changed

- Set tag v0.0.1
- Changed github repository visibility to public

## 2021-08-28

### Changed

 Rebase repository to latest commit

## 2021-08-03

### New Repository

Create repository to be mock API
