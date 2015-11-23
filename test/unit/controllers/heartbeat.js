const expect = require('chai').expect;
const path = require('path');
const projRoot = process.env.PWD;
const controller = require(path.join(projRoot, 'src/server/controllers/heartbeat'));

module.exports = {
  get: get
};

function get(done) {
  const data = controller.get();

  expect(data).to.be.an('object');
  expect(data).to.have.property('message');
  expect(data.message).to.equal('OK');

  return done();
}
