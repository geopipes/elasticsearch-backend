
var extractor = require('../extractor/put');
var fixtures = require('./fixtures/_index');

module.exports.extractor = {};

module.exports.extractor.invalidPut = function(test, common) {
  test('constructor: invalidCallback', function(t) {
    var proxy = extractor();
    t.equal(typeof proxy, 'function', 'function returned');
    try { proxy(); }
    catch (e){
      t.equal(e.message, 'undefined is not a function', 'exception thrown');
      t.end();
    }
  });
}

module.exports.extractor.respEmitsError = function(test, common) {
  test('resp: emitsError', function(t) {
    var proxy = extractor( function( err, resp ){
      t.equal(typeof err, 'string', 'error emitted');
      t.equal(err, 'an upstream error', err);
      t.end();
    });
    t.equal(typeof proxy, 'function', 'function returned');
    proxy( 'an upstream error' ); // upstream error
  });
}

module.exports.extractor.respFail = function(test, common) {
  test('resp: respFail', function(t) {
    var proxy = extractor( function( err, resp ){
      t.equal(err, undefined, 'no error emitted');
      t.equal(resp, false, 'put operation failed');
      t.end();
    });
    t.equal(typeof proxy, 'function', 'function returned');
    proxy(); // no hits
  });
  test('resp: respFail', function(t) {
    var proxy = extractor( function( err, resp ){
      t.equal(err, undefined, 'no error emitted');
      t.equal(resp, false, 'put operation failed');
      t.end();
    });
    t.equal(typeof proxy, 'function', 'function returned');
    proxy( undefined, { created: false } ); // fail
  });
}

module.exports.extractor.respSuccess = function(test, common) {
  test('resp: respSuccess', function(t) {
    var proxy = extractor( function( err, resp ){
      t.equal(err, undefined, 'no error emitted');
      t.equal(typeof resp, 'object', 'put operation success');
      t.equal(resp._id, '1', 'field returned');
      t.equal(resp._index, 'delme', 'field returned');
      t.equal(resp._type, 'tweet', 'field returned');
      t.end();
    });
    t.equal(typeof proxy, 'function', 'function returned');
    proxy( null, fixtures.put );
  });
}

module.exports.extractor.genericFailure = function(test, common) {
  test('resp: genericFailure', function(t) {
    var proxy = extractor( function( err, resp ){
      t.equal(err, fixtures.genericfail.error, 'error emitted');
      t.equal(resp, undefined, 'no results returned');
      t.end();
    });
    t.equal(typeof proxy, 'function', 'function returned');
    proxy( null, fixtures.genericfail );
  });
}

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('put extractor: ' + name, testFunction)
  }

  for( var testCase in module.exports.extractor ){
    module.exports.extractor[testCase](test, common);
  }
}