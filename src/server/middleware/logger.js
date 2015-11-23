const path = require('path');
const morgan = require('morgan');
const projRoot = process.env.PWD;
const config = require(path.join(projRoot, 'src/server/helpers/config'));

module.exports = function(app) {
  if (config.get('EXPRESS_LOG_FORMAT') !== 'OFF') {
    app.use(morgan(config.get('EXPRESS_LOG_FORMAT')));
  }

  return;
};
