'use strict';

const Nightmare = require('nightmare');
const express = require('express');
const wrap = require('co-express');

module.exports = function(app) {
  const router = express.Router();

  router
    .get('/', wrap(function* (req, res) {
      const nightmare = Nightmare({show: false});
      const width = yield nightmare
        .goto('http://localhost:8080/blank/test')
        .wait('svg')
        .evaluate(function() {
          var el = document.getElementsByTagName('text')[0]; // eslint-disable-line

          return el.getComputedTextLength();
        })
        ;

      yield nightmare.end();

      console.log(width); // eslint-disable-line no-console

      return res.send('ok');
    }))
    ;

  app.use('/:text', router);
};

// function buildOptionsFromRequest(req) {
//   const opts = {
//     bg: req.query.bg || '555',
//     fg: req.query.fg || 'FFF',
//     txt: req.query.txt || 'unavailable'
//   };

//   return opts;
// }
