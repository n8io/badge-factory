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
  const data = controller.get();

  return res.json(data);
}
