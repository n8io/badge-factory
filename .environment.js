// Lists out all the environment variables that the app uses
// Either a string or an object with default value
module.exports = [
  'npm_package_name', // app name
  'npm_package_version', // app version
  {'PORT': 4000}, // The port in which the app runs
  {'HOST': '0.0.0.0'}, // The ip or hostname that the app listens on
  'NODE_ENV',
  {'EXPRESS_LOG_FORMAT': 'tiny'}, // The Express logging format
  {'BUNYAN_LOG_LEVEL': 'error'}, // Default bunyan log level
  'LOGGLY_SUBDOMAIN', // Loggly subdomain
  'LOGGLY_TOKEN', // Loggly token,
  'ADMIN_KEY', // Used in the config, debug, diagnostics routes
  'DOCKER_FORCE_NODE_VERSION', // In case you want to restrict the application to an explicit NodeJs version
  {'DOCKER_SERVICE_INSTANCES': 1} // This determines the number of containers stood up in front of haproxy lb
];
