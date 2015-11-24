'use strict';

const fs = require('fs');
const path = require('path');

const projRoot = process.env.PWD;
const svgReadPath = path.join(projRoot, 'src/server/data/base.svg');

const controller = {
  get: get
};

module.exports = controller;

function get(opts) {
  const bgReg = /\{\{bg\}\}/ig;
  const fgReg = /\{\{fg\}\}/ig;
  const txtReg = /\{\{txt\}\}/ig;

  const svg = fs.readFileSync(svgReadPath, 'utf-8').toString();

  return svg
    .replace(bgReg, opts.bg)
    .replace(fgReg, opts.fg)
    .replace(txtReg, opts.txt)
    ;
}
