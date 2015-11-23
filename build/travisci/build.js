const path = require('path');
const fs = require('fs');
const yaml = require('json2yaml');
const request = require('request');
const semver = require('semver');
const projRoot = process.env.PWD;
const packageJson = require(path.join(projRoot, 'package.json'));
const config = require(path.join(projRoot, 'src/server/helpers/config'));
const destPath = path.join(projRoot, '.travis.yml');
const reqOpts = {
  uri: 'https://semver.io/node.json',
  json: true
};

request.get(reqOpts, function(err, res) {
  const semversions = res.body;
  const version = config.get('DOCKER_FORCE_NODE_VERSION') || semver.maxSatisfying(semversions.stableVersions, packageJson.engines.node);

  writeYaml(version);
});

function writeYaml(nodeVersion) {
  const yamlCfg = {
    language: 'node_js',
    'node_js': [
      nodeVersion
    ],
    'after_success': [
      'npm run coverage 2>/dev/null || true'
    ],
    'after_script': [
      'cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js'
    ]
  };

  fs.writeFileSync(destPath, yaml.stringify(yamlCfg));
}
