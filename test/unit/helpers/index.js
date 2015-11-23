const path = require('path');
const projRoot = process.env.PWD;
const envNormSpec = require('./environmentNormalizer');
const loggerSpec = require('./logger');

module.exports = function() {
  describe('environmentNormalizer.normalize()', function() {
    it('should return local when passing loc', envNormSpec.loc);
    it('should return local when passing local', envNormSpec.local);
    it('should return dev when passing ci', envNormSpec.ci);
    it('should return dev when passing dev', envNormSpec.dev);
    it('should return dev when passing development', envNormSpec.development);
    it('should return qa when passing qa', envNormSpec.qa);
    it('should return stg when passing stg', envNormSpec.stg);
    it('should return stg when passing stage', envNormSpec.stage);
    it('should return prod when passing prod', envNormSpec.prod);
    it('should return prod when passing production', envNormSpec.production);
    it('should return prod when passing PrODuCtIoN', envNormSpec.caseInsensitive);
    it('should return prod when passing NOT_VALID', envNormSpec.notValid);
    it('should return prod when passing empty string', envNormSpec.emptyString);
  });

  describe('logger runtime config', function() {
    beforeEach(function(done) {
      const configRelativeFilePath = path.join(projRoot, 'src/server/helpers/config');
      const disabledLogLevel = 'OFF';
      const disabledLogFormat = 'OFF';

      const envVars = {
        bunyanLogLevel: 'BUNYAN_LOG_LEVEL',
        expressLogFormat: 'EXPRESS_LOG_FORMAT'
      };

      process.env[envVars.bunyanLogLevel] = disabledLogLevel;
      process.env[envVars.expressLogFormat] = disabledLogFormat;

      // Wipe require cache so as to reload config and server
      delete require.cache[require.resolve(configRelativeFilePath)];

      return done();
    });

    it('should properly reflect Bunyan env variables not being set', loggerSpec.bunyanNotSet);
    it('should properly set Bunyan env variable', loggerSpec.bunyan);
    it('should properly turn off Bunyan logging', loggerSpec.bunyanOff);
    it('should properly set Bunyan env variable to info', loggerSpec.bunyanInfo);
    it('should properly set Express log format env variable', loggerSpec.expressLogFormat);
    it('should properly enable Express logger w/Bunyan', loggerSpec.expressLoggerWithBunyan);
    it('should properly enable Express logger w/o Bunyan', loggerSpec.expressLoggerWithoutBunyan);
  });
};
