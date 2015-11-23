const assert = require('chai').assert;
const supertest = require('supertest');
const status = require('http-status');
const path = require('path');
const projRoot = process.env.PWD;
const uris = {
  root: '/'
};

module.exports = {
  get: get
};

function get(done) {
  const server = require(path.join(projRoot, 'src/server/app'));

  supertest(server)
    .get(uris.root)
    .expect(status.OK)
    .end(function(err, res) { // eslint-disable-line no-unused-vars
      assert.ifError(err);

      return done();
    })
    ;
}
