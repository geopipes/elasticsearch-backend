
var Backend = require('../');

module.exports.interface = {};

module.exports.interface.get = function(test, common) {
  test('get()', function(t) {
    t.equal(typeof Backend.prototype.get, 'function', 'valid function');
    t.equal(Backend.prototype.get.length, 3, 'consistent arguments length');
    t.end();
  });
}

module.exports.interface.mget = function(test, common) {
  test('mget()', function(t) {
    t.equal(typeof Backend.prototype.mget, 'function', 'valid function');
    t.equal(Backend.prototype.mget.length, 3, 'consistent arguments length');
    t.end();
  });
}

module.exports.interface.put = function(test, common) {
  test('put()', function(t) {
    t.equal(typeof Backend.prototype.put, 'function', 'valid function');
    t.equal(Backend.prototype.put.length, 4, 'consistent arguments length');
    t.end();
  });
}

module.exports.interface.search = function(test, common) {
  test('search()', function(t) {
    t.equal(typeof Backend.prototype.search, 'function', 'valid function');
    t.equal(Backend.prototype.search.length, 3, 'consistent arguments length');
    t.end();
  });
}

module.exports.interface.createPullStream = function(test, common) {
  test('createPullStream()', function(t) {
    t.equal(typeof Backend.prototype.createPullStream, 'function', 'valid function');
    t.equal(Backend.prototype.createPullStream.length, 0, 'consistent arguments length');
    t.end();
  });
}

module.exports.interface.findAdminHeirachy = function(test, common) {
  test('findAdminHeirachy()', function(t) {
    t.equal(typeof Backend.prototype.findAdminHeirachy, 'function', 'valid function');
    t.equal(Backend.prototype.findAdminHeirachy.length, 3, 'consistent arguments length');
    t.end();
  });
}

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('external interface: ' + name, testFunction)
  }

  for( var testCase in module.exports.interface ){
    module.exports.interface[testCase](test, common);
  }
}