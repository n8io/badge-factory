const express = require('express');
const app = express();

const config = require('./helpers/config');
const logger = require('./helpers/logger')();

const port = config.get('PORT');
const host = config.get('HOST');

require('./middleware')(app);
require('./routes')(app);

const server = app.listen(port, host, function() {
  const actualHost = server.address().address;
  const actualPort = server.address().port;

  logger.info('%s@%s listening at http://%s:%s on Node', // eslint-disable-line
    config.get('npm_package_name'),
    config.get('npm_package_version'),
    actualHost,
    actualPort,
    process.version
  );
});

module.exports = server;
