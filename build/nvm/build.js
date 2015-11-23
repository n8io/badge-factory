const path = require('path');
const fs = require('fs');
const request = require('request');
const semver = require('semver');
const projRoot = process.env.PWD;
const packageJson = require(path.join(projRoot, 'package.json'));
const config = require(path.join(projRoot, 'src/server/helpers/config'));
const destPath = path.join(projRoot, '.nvmrc');
const reqOpts = {
  uri: 'https://semver.io/node.json',
  json: true
};

request.get(reqOpts, function(err, res) {
  const semversions = res.body;
  const version = config.get('DOCKER_FORCE_NODE_VERSION') || semver.maxSatisfying(semversions.stableVersions, packageJson.engines.node);

  writeRc(version);
});

function writeRc(nodeVersion) {
  fs.writeFileSync(destPath, nodeVersion);
}
