'use strict';

const path = require('path');
const expect = require('chai').expect;
const supertest = require('supertest');
const projRoot = process.env.PWD;
const configRelativeFilePath = path.join(projRoot, 'src/server/helpers/config');
const serverRelativePath = path.join(projRoot, 'src/server/app');

module.exports = {
  bunyan: bunyan,
  bunyanOff: bunyanOff,
  bunyanInfo: bunyanInfo,
  bunyanNotSet: bunyanNotSet,
  expressLogFormat: expressLogFormat,
  expressLoggerWithoutBunyan: expressLoggerWithoutBunyan,
  expressLoggerWithBunyan: expressLoggerWithBunyan
};

function expressLogFormat(done) {
  let config;
  let server;

  const testLogFormat = 'test_logformat';
  const envVar = 'EXPRESS_LOG_FORMAT';

  process.env[envVar] = testLogFormat;

  server = require(serverRelativePath);

  supertest(server);

  config = require(configRelativeFilePath);

  expect(config.get(envVar)).to.equal(testLogFormat);

  return done();
}

function expressLoggerWithoutBunyan(done) {
  let config;
  let server;

  const testLogFormat = 'test_logformat';
  const testLogLevel = 'OFF';

  const envVars = {
    expressLogFormat: 'EXPRESS_LOG_FORMAT',
    bunyanLogLevel: 'BUNYAN_LOG_LEVEL'
  };

  process.env[envVars.expressLogFormat] = testLogFormat;
  process.env[envVars.bunyanLogLevel] = testLogLevel;

  config = require(configRelativeFilePath);
  server = require(serverRelativePath);

  supertest(server);

  expect(config.get(envVars.expressLogFormat)).to.equal(testLogFormat);
  expect(config.get(envVars.bunyanLogLevel)).to.equal(testLogLevel);

  return done();
}

function expressLoggerWithBunyan(done) {
  let config;
  let server;

  const testLogFormat = 'test_logformat';
  const testLogLevel = 'info';

  const envVars = {
    expressLogFormat: 'EXPRESS_LOG_FORMAT',
    bunyanLogLevel: 'BUNYAN_LOG_LEVEL'
  };

  process.env[envVars.expressLogFormat] = testLogFormat;
  process.env[envVars.bunyanLogLevel] = testLogLevel;

  config = require(configRelativeFilePath);
  server = require(serverRelativePath);

  supertest(server);

  expect(config.get(envVars.expressLogFormat)).to.equal(testLogFormat);
  expect(config.get(envVars.bunyanLogLevel)).to.equal(testLogLevel);

  return done();
}

function bunyan(done) {
  let config;
  let server;

  const testLogLevel = 'error';
  const envVar = 'BUNYAN_LOG_LEVEL';

  process.env[envVar] = testLogLevel;

  config = require(configRelativeFilePath);
  server = require(serverRelativePath);

  supertest(server);

  expect(config.get(envVar)).to.equal(testLogLevel);

  return done();
}

function bunyanInfo(done) {
  let config;
  let server;

  const testLogLevel = 'info';
  const envVar = 'BUNYAN_LOG_LEVEL';

  process.env[envVar] = testLogLevel;

  config = require(configRelativeFilePath);
  server = require(serverRelativePath);

  supertest(server);

  expect(config.get(envVar)).to.equal(testLogLevel);

  return done();
}

function bunyanOff(done) {
  let config;
  let server;

  const testLogLevel = 'OFF';
  const envVar = 'BUNYAN_LOG_LEVEL';

  process.env[envVar] = testLogLevel;

  config = require(configRelativeFilePath);
  server = require(serverRelativePath);

  supertest(server);

  expect(config.get(envVar)).to.equal(testLogLevel);

  return done();
}

function bunyanNotSet(done) {
  let config;
  let server;

  const testLogLevel = '';
  const envVar = 'BUNYAN_LOG_LEVEL';

  process.env[envVar] = testLogLevel;

  config = require(configRelativeFilePath);
  server = require(serverRelativePath);

  supertest(server);

  expect(config.get(envVar)).to.equal(testLogLevel);

  return done();
}
