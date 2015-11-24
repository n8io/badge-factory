const os = require('os');

const controller = {
  get: get
};

module.exports = controller;

function get() {
  return {
    message: 'OK',
    hostname: os.hostname()
  };
}
