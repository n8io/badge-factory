'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const cfg = require('nconf');
const projRoot = process.env.PWD;
const envNormalizer = require(path.join(projRoot, 'src/server/helpers/environmentNormalizer'));
const envKeys = require(path.join(projRoot, '.environment'));
const commitFile = path.join(projRoot, '.git.json');
const packageJson = path.join(projRoot, 'package.json');
const envSettings = parseEnvironmentVars(envKeys);

cfg.use('memory');

cfg.env(envSettings.env);

cfg.set('pkgJson', JSON.parse(fs.readFileSync(packageJson, 'utf-8')));
cfg.set('git', JSON.parse(fs.readFileSync(commitFile, 'utf-8')));
cfg.set('NODE_ENV', envNormalizer.normalize(cfg.get('NODE_ENV')));
cfg.set('app:major', cfg.get('npm_package_version').split('.')[0]);
cfg.set('app:minor', cfg.get('npm_package_version').split('.')[1]);
cfg.set('app:revision', cfg.get('npm_package_version').split('.')[2]);

cfg.defaults(envSettings.defaults);

module.exports = cfg;

// Parse the environments array and give me a workable object back
function parseEnvironmentVars(keys) {
  const data = {
    env: [],
    defaults: {}
  };

  _.each(keys, function(key) {
    let name = key;

    if (_.isObject(key)) {
      name = _.keys(key)[0];
      data.defaults[name] = _.values(key)[0];
    }

    data.env.push(name);
  });

  return data;
}
