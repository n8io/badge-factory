const express = require('express');

module.exports = function(app) {
  const router = express.Router();

  router
    .get('/:text', get)
    ;

  app.use('/blank', router);
};

function get(req, res) {
  const opts = buildOptionsFromRequest(req);

  return res
    .status(200)
    .render('blank', opts);
}

function buildOptionsFromRequest(req) {
  const opts = {
    bg: parseParams(req.query.bg, '555', function(txt) {
      return txt.replace(/(#)/ig, '');
    }),
    fg: parseParams(req.query.fg, 'FFF', function(txt) {
      return txt.replace(/(#)/ig, '');
    }),
    txt: parseParams(req.params.text, 'blank'),
    fsize: parseParams(req.query.fsize, 12, function(size) {
      return parseInt(size, 10);
    }),
    br: parseParams(req.query.br, 3, function(radius) {
      return parseInt(radius, 10);
    }),
    vPad: parseParams(req.query.vPad, 2, function(pad) {
      return parseInt(pad, 10);
    }),
    hPad: parseParams(req.query.hPad, 3, function(pad) {
      return parseInt(pad, 10);
    }),
    bold: parseParams(req.query.bold, false, function(b) {
      const boldReg = /^(true|1)$/i;

      return boldReg.test(b.toString());
    }),
    ff: parseParams(req.query.ff, 'Arial, sans-serif, monospace'),
    flat: parseParams(req.query.flat, false, function(b) {
      const flatReg = /^(true|1)$/i;

      return flatReg.test(b.toString());
    })
  };

  if (req.query.pad) {
    opts.pad = req.query.pad;
  }

  return opts;
}

function parseParams(raw, defaultVal, mixin) {
  if (typeof raw === 'undefined') {
    return defaultVal;
  }

  return typeof mixin === 'function' ? mixin(raw) : raw;
}
