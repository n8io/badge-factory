'use strict';

const url = require('url');
const path = require('path');

const projRoot = process.env.PWD;
const Nightmare = require('nightmare');
const express = require('express');
const co = require('co');
const config = require(path.join(projRoot, 'src/server/helpers/config'));
const jade = require('jade');
const _ = require('lodash');

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
  const urlObj = url.parse(`http://${host}/blank/${encodeURIComponent(opts.txt)}`);

  if (!opts.txt.trim()) {
    return res
      .status(401)
      .send({
        message: 'If you don\'t want to provide any text, pass ?txt=blank'
      })
      ;
  }

  urlObj.query = _.omit(opts, 'txt');

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
