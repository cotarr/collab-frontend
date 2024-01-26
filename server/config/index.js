'use strict';

// const path = require('path');

// Import UNIX environment variables from .env file and add to process.env
require('dotenv').config();

// const nodeEnv = process.env.NODE_ENV || 'development';

// Check requirement for minimum node version
const minNodeVersion = 18;
if (parseInt(process.version.replace('v', '').split('.')[0]) < minNodeVersion) {
  console.error('Error: this program requires node version ' +
    minNodeVersion.toString() + ' or greater.');
  process.exit(1);
}

exports.site = {
  // Vhost example: "auth.example.com". Use '*' to accept any URL or numeric IP
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
  pidFilename: process.env.SERVER_PID_FILENAME || '',
  logRotateInterval: process.env.SERVER_LOG_ROTATE_INTERVAL || '',
  logRotateSize: process.env.SERVER_LOG_ROTATE_SIZE || '',
  logFilter: process.env.SERVER_LOG_FILTER || ''
};

exports.session = {
  rollingCookie: (process.env.SESSION_SET_ROLLING_COOKIE === 'true') || false,
  // 604800 = 7 days (7 * 24 * 3600)
  maxAge: parseInt(process.env.SESSION_EXPIRE_SEC || '604800') * 1000,
  ttl: parseInt(process.env.SESSION_EXPIRE_SEC || '604800'),
  // pruneInterval applies only to Memorystore, redis will ignore
  pruneInterval: parseInt(process.env.SESSION_PRUNE_INTERVAL_SEC || '86400'),
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

exports.limits = {
  webRateLimitCount: parseInt(process.env.LIMITS_WEB_RATE_LIMIT_COUNT || '100'),
  webRateLimitTimeMs: parseInt(process.env.LIMITS_WEB_RATE_LIMIT_MS || '300000')
};

exports.remote = {
  apiURL: process.env.REMOTE_API_URL || 'http://localhost:4000'
};
