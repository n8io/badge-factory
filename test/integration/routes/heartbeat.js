const assert = require('chai').assert;
const supertest = require('supertest');
const status = require('http-status');
const path = require('path');
const projRoot = process.env.PWD;
const uris = {
  heartbeat: '/heartbeat'
};

module.exports = {
  get: get
};

function get(done) {
  const server = require(path.join(projRoot, 'src/server/app'));

  supertest(server)
    .get(uris.heartbeat)
    .expect(status.OK)
    .end(function(err) {
      assert.ifError(err);

      return done();
    })
    ;
}
