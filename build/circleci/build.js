const path = require('path');
const fs = require('fs');
const yaml = require('json2yaml');
const request = require('request');
const semver = require('semver');
const projRoot = process.env.PWD;
const packageJsonPath = path.join(projRoot, 'package.json');
const packageJson = require(packageJsonPath);
const config = require(path.join(projRoot, 'src/server/helpers/config'));
const destPath = path.join(projRoot, 'circle.yml');
const reqOpts = {
  uri: 'https://semver.io/node.json',
  json: true
};

request.get(reqOpts, function(err, res) {
  const semversions = res.body;
  const version = config.get('DOCKER_FORCE_NODE_VERSION') || semver.maxSatisfying(semversions.stableVersions, packageJson.engines.node);

  writeCircleCiYaml(version);
});

function writeCircleCiYaml(nodeVersion) {
  const yamlCfg = {
    machine: {
      node: {
        version: nodeVersion
      }
    },
    deployment: {
      develop: {
        branch: 'develop',
        heroku: {
          appname: 'n8io-badge-factory-dev'
        }
      }
    }
  };

  fs.writeFileSync(destPath, yaml.stringify(yamlCfg));
}
