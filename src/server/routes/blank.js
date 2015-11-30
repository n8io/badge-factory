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
    bg: req.query.bg || '222',
    fg: req.query.fg || 'FFF',
    txt: req.params.text || 'blank',
    hPad: typeof req.query.hPad !== 'undefined' ? parseInt(req.query.hPad, 10) : -1,
    vPad: typeof req.query.vPad !== 'undefined' ? parseInt(req.query.vPad, 10) : -1,
    fsize: typeof req.query.fsize !== 'undefined' ? parseInt(req.query.fsize, 10) : 12,
    br: typeof req.query.br !== 'undefined' ? parseInt(req.query.br, 10) : 3,
    bold: !!parseInt(req.query.bold, 10),
    ff: req.query.ff || 'Arial,Helvetica,Verdana,Geneva,sans-serif'
  };

  if (opts.hPad === -1) {
    opts.hPad = parseInt(opts.fsize / 2.4, 10);
  }

  if (opts.vPad === -1) {
    opts.vPad = parseInt(opts.fsize / 3.2, 10);
  }

  return opts;
}
