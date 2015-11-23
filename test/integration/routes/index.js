const path = require('path');
const projRoot = process.env.PWD;
const rootSpec = require('./root');
const heartbeatSpec = require('./heartbeat');
const configRelativeFilePath = path.join(projRoot, 'src/server/helpers/config');
const serverRelativePath = path.join(projRoot, 'src/server/app');

module.exports = function() {
  describe('root.get()', function() {
    beforeEach(function(done) {
      const disabledLogLevel = 'OFF';
      const disabledLogFormat = 'OFF';

      const envVars = {
        bunyanLogLevel: 'BUNYAN_LOGLEVEL',
        expressLogFormat: 'EXPRESS_LOG_FORMAT'
      };

      process.env[envVars.bunyanLogLevel] = disabledLogLevel;
      process.env[envVars.expressLogFormat] = disabledLogFormat;

      // Wipe require cache so as to reload config and server
      delete require.cache[require.resolve(configRelativeFilePath)];
      delete require.cache[require.resolve(serverRelativePath)];

      return done();
    });

    it('should return a 200 OK', rootSpec.get);
  });

  describe('heartbeat.get()', function() {
    beforeEach(function(done) {
      const disabledLogLevel = 'OFF';
      const disabledLogFormat = 'OFF';

      const envVars = {
        bunyanLogLevel: 'BUNYAN_LOGLEVEL',
        expressLogFormat: 'EXPRESS_LOG_FORMAT'
      };

      process.env[envVars.bunyanLogLevel] = disabledLogLevel;
      process.env[envVars.expressLogFormat] = disabledLogFormat;

      // Wipe require cache so as to reload config and server
      delete require.cache[require.resolve(configRelativeFilePath)];
      delete require.cache[require.resolve(serverRelativePath)];

      return done();
    });

    it('should return a 200 OK', heartbeatSpec.get);
  });
};
