const express = require('express');

module.exports = function(app) {
  const router = express.Router();

  router
    .get('/', function(req, res) { // eslint-disable-line
      return res.json({message: 'OK'});
    })
    ;

  app.use('/heartbeat', router);
};
