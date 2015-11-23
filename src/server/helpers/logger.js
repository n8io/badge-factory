const bunyan = require('bunyan');

const config = require('./config');

module.exports = function() {
  const streams = [];

  if (config.get('BUNYAN_LOG_LEVEL') !== 'OFF') {
    streams.push({
      stream: process.stdout,
      level: config.get('BUNYAN_LOG_LEVEL')
    });
  }

  return bunyan.createLogger({
    name: config.get('npm_package_name'),
    streams: streams,
    serializers: bunyan.stdSerializers
  });
};
