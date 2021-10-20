'use strict';

const path = require('path');

require('dotenv').config();

// const nodeEnv = process.env.NODE_ENV || 'development';

exports.site = {
  // Vhost example: "auth.example.com"
  vhost: process.env.SITE_VHOST || '*',
  // Example: "mailto:security@example.com",
  securityContact: process.env.SITE_SECURITY_CONTACT || '',
  // Example: "Fri, 1 Apr 2022 08:00:00 -0600"
  securityExpires: process.env.SITE_SECURITY_EXPIRES || ''
};

exports.server = {
  serverTlsKey: process.env.SERVER_TLS_KEY || '',
  serverTlsCert: process.env.SERVER_TLS_CERT || '',
  tls: (process.env.SERVER_TLS === 'true') || false,
  port: parseInt(process.env.SERVER_PORT || '3000'),
  pidFilename: process.env.SERVER_PID_FILENAME || ''
};

exports.session = {
  maxAge: parseInt(process.env.SESSION_EXPIRE_SEC || '604800') * 1000,
  ttl: parseInt(process.env.SESSION_EXPIRE_SEC || '608400'),
  secret: process.env.SESSION_SECRET || 'Change Me',
  enableRedis: (process.env.SESSION_ENABLE_REDIS === 'true') || false,
  redisPrefix: process.env.SESSION_REDIS_PREFIX || 'session:',
  redisPassword: process.env.SESSION_REDIS_PASSWORD || ''
};

exports.oauth2 = {
  clientId: process.env.OAUTH2_CLIENT_ID || 'abc123',
  clientSecret: process.env.OAUTH2_CLIENT_SECRET || 'ssh-secret',
  // mainURL is used to form oauth2 redirectURI by adding "/login/callback"
  // The redirect URI must be in client allowedRedirectURI list.
  mainURL: process.env.OAUTH2_MAIN_URL || 'http://localhost:3000',
  authURL: process.env.OAUTH2_AUTH_URL || 'http://127.0.0.1:3500',
  requestedScope: JSON.parse(process.env.OAUTH2_REQUESTED_SCOPE ||
    '["api.read", "api.write"]')

};

exports.remote = {
  apiURL: process.env.REMOTE_API_URL || 'http://localhost:4000'
};
