const fs = require('fs');
const os = require('os');
const path = require('path');
const url = require('url'); // Used to parse out the pathname of the repo to determine the proper image name

const moment = require('moment'); // Used to timestamp the docker image within the metadata (LABELs)
const request = require('request'); // Used to make an http request to get the all of stable node versions
const semver = require('semver'); // Used to parse the max semversion based upon the range defined in the package.json
const yaml = require('json2yaml'); // Used to write docker-compose.yml
const sortJson = require('sort-json');

const projRoot = process.env.PWD;
const config = require(path.join(projRoot, 'src/server/helpers/config'));
const dockerComposeFileDest = path.join(projRoot, 'docker-compose.yml');
const dockerFileDest = path.join(projRoot, 'Dockerfile');
const dockerIgnoreSrc = path.join(__dirname, '{{dockerBuildType}}/.dockerignore');
const dockerIgnoreDest = path.join(projRoot, '.dockerignore');
const gitInfo = require(path.join(projRoot, '.git.json'));
const packageJsonFileDest = path.join(projRoot, 'package.json');

const packageJson = require(packageJsonFileDest);
const numberOfInstances = parseInt(config.get('DOCKER_SERVICE_INSTANCES'), 0) || 1; // Used to scale the docker containers properly with haproxy
const dockerImageTag = getDockerImageTag(packageJson);
const validDockerBuildTypes = {
  local: 'local',
  release: 'release'
};
const dockerBuildType = validDockerBuildTypes[(process.env.DOCKER_BUILD_TYPE || '').toLowerCase()] || validDockerBuildTypes.local;
const serviceName = 'service';

const dfBuilder = require('node-dockerfile');
const dockerFile = new dfBuilder();

const reqOpts = {
  uri: 'https://semver.io/node.json',
  json: true
};

request.get(reqOpts, function(err, res) {
  const semversions = res.body;
  const version = config.get('DOCKER_FORCE_NODE_VERSION') || semver.maxSatisfying(semversions.stableVersions, packageJson.engines.node);

  writeDockerFile(version, dockerBuildType, validDockerBuildTypes, dockerFileDest);
  writeDockerComposeFile(version, dockerBuildType, dockerComposeFileDest);
  writePackageJsonDockerScripts(packageJson, packageJsonFileDest);
});

function getDockerImageTag(packageJson) {
  const urlObj = url.parse(packageJson.repository.url);
  const imageName = urlObj.pathname.replace('/', '');

  return `${imageName}:${packageJson.version}`;
}

function writeDockerFile(version, dockerBuildType, validDockerBuildTypes, destPath) {
  const now = moment();

  dockerFile
    .comment('Automatically determined based upon package.json')
    .from(`node:${version}`)
    .newLine()
    .comment('Create a directory to hold your application')
    .run('mkdir -p /src')
    .newLine()
    .comment('Set $cwd')
    .workDir('/src')
    .newLine()
    .comment('Copy the package.json so we don\'t retrigger unecessary npm installs')
    .add('package.json', 'package.json')
    ;

  dockerFile
    .newLine()
    .comment('Run npm install')
    .run('npm install -q --production')
    ;

  dockerFile
    .newLine()
    .comment('Add the current directories contents to the container\'s /src directory')
    .copy('.', '.')
    .newLine()
    .comment('Define the default run command. Not actually ran on [docker build].')
    .comment('This command is only executed on [docker run].')
    .cmd([
      'npm',
      'run',
      dockerBuildType === validDockerBuildTypes.local ? 'dev' : 'start'
    ])
    ;

  if (dockerBuildType === validDockerBuildTypes.release) {
    dockerFile
      .newLine()
      .comment('Dockerfile metadata')
      .label(`${packageJson.name}.version`, packageJson.version)
      .label('os.hostname', os.hostname())
      .label('os.platform', os.platform())
      .label('os.arch', os.arch())
      .label('git.branch', gitInfo.branch)
      .label('git.commit', gitInfo.commit)
      .label('dockerfile.timestamp', now.format('x'))
      ;
  }

  dockerFile
    .newLine()
    .writeStream()
    .pipe(fs.createWriteStream(destPath))
    ;
}

function writeDockerComposeFile(version, dockerBuildType, destPath) {
  const yamlCfg = {};

  yamlCfg[serviceName] = {
    image: dockerImageTag,
    expose: [
      config.get('PORT')
    ],
    environment: [
      `PORT=${config.get('PORT')}`,
      `HOST=${config.get('HOST')}`
    ],
    volumes: [
      '.:/src'
    ]
  };

  yamlCfg.haproxy = {
    image: 'tutum/haproxy',
    links: [
      serviceName
    ],
    ports: [
      '80:80',
      '70:70'
    ],
    expose: [
      '80',
      '70'
    ]
  };

  fs
    .createReadStream(dockerIgnoreSrc.replace('{{dockerBuildType}}', dockerBuildType))
    .pipe(fs.createWriteStream(dockerIgnoreDest));

  fs.writeFileSync(destPath, yaml.stringify(yamlCfg));
}

function writePackageJsonDockerScripts(packageJson, destPath) {
  packageJson.scripts.docker = 'npm run docker:prep && npm run docker:rebuild && npm run docker:up';
  packageJson.scripts['docker:build'] = `docker build -t ${dockerImageTag} -f ./Dockerfile .`;
  packageJson.scripts['docker:clean'] = 'npm run docker:clean:containers && npm run docker:clean:image';
  packageJson.scripts['docker:clean:containers'] = 'docker-compose stop && docker-compose rm -f';
  packageJson.scripts['docker:clean:image'] = `docker images -q ${dockerImageTag} | xargs docker rmi -f`;
  packageJson.scripts['docker:prep'] = 'gulp git-info && npm run build:docker';
  packageJson.scripts['docker:rebuild'] = 'npm run docker:clean && npm run docker:build';
  packageJson.scripts['docker:restart'] = 'npm run docker:clean:containers && npm run docker:prep && npm run docker:up';
  packageJson.scripts['docker:up'] = `docker-compose scale ${serviceName}=${numberOfInstances} haproxy=1`;

  packageJson.scripts = sortJson(packageJson.scripts);

  fs.writeFileSync(destPath, `${JSON.stringify(packageJson, null, 2)}\n`);
}
