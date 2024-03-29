//
// This module sets configuration options to be used
// by the morgan http log module.
//
// it returns an object
// {
//   format: (string)
//   options: (object)
// }
// -----------------------------------------------------
'use strict';

const fs = require('fs');
const path = require('path');
const rotatingFileStream = require('rotating-file-stream');

// CUstom modules
const config = require('../config');

const nodeEnv = process.env.NODE_ENV || 'development';
// in the case of NODE_ENV=production, force logging to console.
const nodeDebugLog = process.env.NODE_DEBUG_LOG || 0;

let logToFile = (nodeEnv === 'production');
let errorFilter = ((nodeEnv === 'production') && (config.server.logFilter === 'error'));

// enable console logging in production by export NODE_DEBUG_LOG=1
if (nodeDebugLog) {
  logToFile = false;
  errorFilter = false;
}

const logFolder = path.join(__dirname, '../../logs');
const logFilename = logFolder + '/access.log';

//
// If the log/ folder does not exist, then create it
//
if (logToFile) {
  console.log('logFolder ' + logFolder);
  try {
    if (!fs.existsSync(logFolder)) {
      console.log('Log folder not found, creating folder...');
      fs.mkdirSync(logFolder);
      fs.chmodSync(logFolder, 0o700);
    }
  } catch (err) {
    console.log('Unable to create log folder');
    console.error(err);
    process.exit(1);
  }
}

/**
 * Morgan logger configuration
 * @property {string} logConfig.format - Morgan format string
 * @property {Object} logConfig.options - Morgan options
 */
const logConfig = {};

logConfig.format = ':date[iso] :remote-addr :status :method :http-version :req[host]:url';
logConfig.options = {};

// for start up message
let logStream = '(console)';

if (logToFile) {
  // for start up message
  logStream = logFilename;
  // Function to write log entries to file as option property
  if (((config.server.logRotateInterval) && (config.server.logRotateInterval.length > 1)) ||
    ((config.server.logRotateSize) && (config.server.logRotateSize.length > 1))) {
    const rotateOptions = {
      encoding: 'utf8',
      mode: 0o600,
      rotate: 5
    };
    logStream += ' (Rotate';
    if ((config.server.logRotateInterval) && (config.server.logRotateInterval.length > 1)) {
      rotateOptions.interval = config.server.logRotateInterval;
      logStream += ' interval:' + config.server.logRotateInterval;
    }
    if ((config.server.logRotateSize) && (config.server.logRotateSize.length > 1)) {
      rotateOptions.size = config.server.logRotateSize;
      logStream += ' size:' + config.server.logRotateSize;
    }
    logStream += ')';
    logConfig.options.stream = rotatingFileStream.createStream(logFilename, rotateOptions);
  } else {
    // Function to write log entries to file as option property
    logConfig.options.stream = fs.createWriteStream(logFilename, {
      encoding: 'utf8',
      mode: 0o600,
      flags: 'a'
    });
  }
};

//
// Filter function: If enabled, log only requrests with error status codes
//
if (errorFilter) {
  // for start up message
  logStream += ' (Errors Only)';
  // Function to filter log entries as option property
  logConfig.options.skip = (req, res) => {
    return ((res.statusCode < 400) || (res.statusCode === 404));
  };
} // if (errorFilter)

// This shows at server start up to console out
console.log('HTTP Access Log: ' + logStream);

module.exports = logConfig;
