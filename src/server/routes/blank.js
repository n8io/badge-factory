const express = require('express');

module.exports = function(app) {
  const router = express.Router();

  router
    .get('/:text', get)
    ;

  app.use('/blank', router);
};

function get(req, res) {
  return res
    .status(200)
    .render('blank', {text: req.params.text || ''});
}
