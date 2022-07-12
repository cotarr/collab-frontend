# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
