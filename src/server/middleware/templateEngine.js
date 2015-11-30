const path = require('path');
const projRoot = process.env.PWD;

module.exports = function(app) {
  app.set('views', path.join(projRoot, 'src/server/views'));
  app.set('view engine', 'jade');
};
