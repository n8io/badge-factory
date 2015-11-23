'use strict';

const path = require('path');
const fs = require('fs');
const projRoot = process.env.PWD;
const packageJson = require(path.join(projRoot, 'package.json'));
const readMeFilePath = path.join(projRoot, 'README.md');

writeReadMe(packageJson.engines.node);

function writeReadMe(version) {
  const readMeStr = fs.readFileSync(readMeFilePath, 'utf8').toString();
  const nodeLogoReg = /http:\/\/img\.shields\.io\/badge\/node-([\^~]?\d(\.\d){0,2})-[a-z]+\.svg/ig;
  const nodeVersionReg = /([\^~]?\d(\.\d){0,2})/i;

  let output = readMeStr;
  const matches = output.match(nodeLogoReg);

  if (!matches) {
    return;
  }

  const newLogoUrl = matches[0].replace(nodeVersionReg, version);

  output = output.replace(matches[0], newLogoUrl);

  fs.writeFileSync(readMeFilePath, output);
}
