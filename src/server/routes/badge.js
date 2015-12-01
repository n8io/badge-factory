'use strict';

const url = require('url');
const path = require('path');

const projRoot = process.env.PWD;
const Nightmare = require('nightmare');
const express = require('express');
const co = require('co');
const config = require(path.join(projRoot, 'src/server/helpers/config'));
const jade = require('jade');

module.exports = function(app) {
  const router = express.Router();

  router
    .get('/:text.svg', buildOutSvg)
    ;

  app.use('/badge', router);
};

function buildOutSvg(req, res) {
  const opts = buildOptionsFromRequest(req);
  const host = process.env.NODE_ENV !== 'local' ? config.get('HOST') : `${config.get('HOST')}:${config.get('PORT')}`;
  const urlObj = url.parse(`http://${host}/blank/${opts.txt}`);

  if (!opts.txt.trim()) {
    return res
      .status(401)
      .send({
        message: 'If you don\'t want to provide any text, pass ?text=blank'
      })
      ;
  }

  urlObj.query = opts;

  co(function* () {
    const nightmare = Nightmare({show: false});
    const dimensions = yield nightmare
      .goto(url.format(urlObj))
      .wait('#width')
      .evaluate(function() {
        var el = document.getElementsByTagName('text')[0]; // eslint-disable-line

        return {
          height: document.getElementById('height').innerHTML,
          width: document.getElementById('width').innerHTML
        };
      })
      ;

    yield nightmare.end();

    return dimensions;
  }).then(onSuccess, onError);

  function onSuccess(dimensions) {
    opts.width = parseInt(dimensions.width, 10) + (opts.hPad * 2);
    opts.height = parseInt(dimensions.height, 10) + (opts.vPad * 2);

    const svgXml = jade.renderFile(path.join(projRoot, 'src/server/views/svg.jade'), opts);

    res
      .status(200)
      .type('image/svg+xml')
      .write(svgXml)
      ;

    return res.end();
  }

  function onError(err) {
    console.log('error', err); // eslint-disable-line no-console

    return res
      .status(500)
      .send(err)
      ;
  }
}

function buildOptionsFromRequest(req) {
  const opts = {
    bg: req.query.bg || '555',
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
