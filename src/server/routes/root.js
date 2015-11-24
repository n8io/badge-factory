const path = require('path');

const express = require('express');
const controller = require(path.join(process.env.PWD, 'src/server/controllers/root'));

module.exports = function(app) {
  const router = express.Router();

  router
    .get('/', get)
    ;

  app.use('/', router);
};

function get(req, res) {
  const data = controller.get(buildOptionsFromRequest(req));

  return res
    .type('image/svg')
    .status(200)
    .send(data);
}

function buildOptionsFromRequest(req) {
  const opts = {
    bg: req.params.bg || '#555',
    fg: req.params.fg || '#FFF',
    text: req.params.txt || 'unavailable'
  };

  return opts;
}
