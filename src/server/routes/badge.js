const path = require('path');

const express = require('express');
const controller = require(path.join(process.env.PWD, 'src/server/controllers/badge'));

module.exports = function(app) {
  const router = express.Router();

  router
    .get('/', get)
    ;

  app.use('/badge.svg', router);
};

function get(req, res) {
  const data = controller.get(buildOptionsFromRequest(req));

  return res
    .type('image/svg+xml')
    .status(200)
    .send(data);
}

function buildOptionsFromRequest(req) {
  const opts = {
    bg: req.query.bg || '555',
    fg: req.query.fg || 'FFF',
    txt: req.query.txt || 'unavailable'
  };

  return opts;
}
