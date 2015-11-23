const expect = require('chai').expect;
const path = require('path');
const projRoot = process.env.PWD;
const environmentNormalizer = require(path.join(projRoot, 'src/server/helpers/environmentNormalizer'));

module.exports = {
  loc: loc,
  local: local,
  dev: dev,
  development: development,
  ci: ci,
  qa: qa,
  stg: stg,
  stage: stage,
  prod: prod,
  production: production,
  caseInsensitive: caseInsensitive,
  notValid: notValid,
  emptyString: emptyString
};

function loc(done) {
  const env = environmentNormalizer.normalize('loc');

  expect(env).to.equal('local');

  return done();
}

function local(done) {
  const env = environmentNormalizer.normalize('local');

  expect(env).to.equal('local');

  return done();
}

function dev(done) {
  const env = environmentNormalizer.normalize('dev');

  expect(env).to.equal('dev');

  return done();
}

function development(done) {
  const env = environmentNormalizer.normalize('development');

  expect(env).to.equal('dev');

  return done();
}

function ci(done) {
  const env = environmentNormalizer.normalize('ci');

  expect(env).to.equal('dev');

  return done();
}

function qa(done) {
  const env = environmentNormalizer.normalize('qa');

  expect(env).to.equal('qa');

  return done();
}

function stg(done) {
  const env = environmentNormalizer.normalize('stg');

  expect(env).to.equal('stg');

  return done();
}

function stage(done) {
  const env = environmentNormalizer.normalize('stage');

  expect(env).to.equal('stg');

  return done();
}

function prod(done) {
  const env = environmentNormalizer.normalize('prod');

  expect(env).to.equal('prod');

  return done();
}

function production(done) {
  const env = environmentNormalizer.normalize('production');

  expect(env).to.equal('prod');

  return done();
}

function caseInsensitive(done) {
  const env = environmentNormalizer.normalize('PrODuCtIoN');

  expect(env).to.equal('prod');

  return done();
}

function notValid(done) {
  const env = environmentNormalizer.normalize('NOT_VALID');

  expect(env).to.equal('prod');

  return done();
}

function emptyString(done) {
  const env = environmentNormalizer.normalize('');

  expect(env).to.equal('prod');

  return done();
}
