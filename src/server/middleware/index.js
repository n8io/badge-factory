const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const routesDir = 'src/server/middleware';

module.exports = function(app) {
  const prioritizedMiddleware = [
    './heartbeat',
    './logger'
  ];

  // Normalize to absolute paths
  const routes = _.map(prioritizedMiddleware, function(mw) {
    return getRouteAbsolutePath(mw);
  });

  fs.readdirSync(__dirname).forEach(function(file) {
    if (file.toLowerCase() === 'index.js') {
      return; // We don't want to require index.js's
    }

    const filePath  = path.join(__dirname, file.split('.js').join(''));

    // If route isn't in the list already, lets add it to the list
    /* istanbul ignore if */
    if (routes.indexOf(filePath) === -1) {
      routes.push(filePath);
    }
  });

  // Finally register the routes with the app
  _.each(routes, function(mw) {
    require(mw)(app);
  });
};

function getRouteAbsolutePath(relativeToRoutesDirPath) {
  return path.join(process.env.PWD, routesDir, relativeToRoutesDirPath);
}
