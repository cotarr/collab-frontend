'use strict';

const path = require('path');

require('dotenv').config();

// const nodeEnv = process.env.NODE_ENV || 'development';

exports.nodeDebugLog = process.env.NODE_DEBUG_LOG || 0;

exports.site = {
  // Vhost example: "auth.example.com"
  vhost: process.env.SITE_VHOST || '*',
  // Example: "mailto:security@example.com",
  securityContact: process.env.SITE_SECURITY_CONTACT || '',
  // Example: "Fri, 1 Apr 2022 08:00:00 -0600"
  securityExpires: process.env.SITE_SECURITY_EXPIRES || ''
};

exports.server = {
  serverTlsKey: process.env.SERVER_TLS_KEY ||
    path.join(__dirname, './server/certs/privatekey.pem'),
  serverTlsCert: process.env.SERVER_TLS_CERT ||
    path.join(__dirname, './server/certs/certificate.pem'),
  tls: (process.env.SERVER_TLS === 'true') || false,
  port: process.env.SERVER_PORT || 3000,
  pidFilename: process.env.SERVER_PID_FILENAME || ''
};

exports.session = {
  maxAge: (process.env.SESSION_EXPIRE_SEC * 1000) || (7 * 24 * 3600000),
  ttl: process.env.SESSION_EXPIRE_SEC || (7 * 24 * 3600),
  secret: process.env.SESSION_SECRET || 'Change Me',
  disableMemorystore: (process.env.SESSION_DISABLE_MEMORYSTORE === 'true') || false
};

exports.oauth2 = {
  clientId: process.env.OAUTH2_CLIENT_ID || 'abc123',
  clientSecret: process.env.OAUTH2_CLIENT_SECRET || 'ssh-secret',
  mainURL: process.env.OAUTH2_MAIN_URL || 'http://localhost:3000',
  authURL: process.env.OAUTH2_AUTH_URL || 'http://127.0.0.1:3500'
};

exports.remote = {
  apiURL: process.env.REMOTE_API_URL || 'http://localhost:4000'
};
