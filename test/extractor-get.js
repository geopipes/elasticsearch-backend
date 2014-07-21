
var extractor = require('../extractor/get');
var fixtures = { get: require('./fixtures/getQuery') }

module.exports.extractor = {};

module.exports.extractor.invalidSearch = function(test, common) {
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

module.exports.extractor.respNoHits = function(test, common) {
  test('resp: respNoHits', function(t) {
    var proxy = extractor( function( err, resp ){
      t.equal(err, undefined, 'no error emitted');
      t.equal(resp, undefined, 'no result returned');
      t.end();
    });
    t.equal(typeof proxy, 'function', 'function returned');
    proxy(); // no hits
  });
}

// Returned single result
module.exports.extractor.respGotHit = function(test, common) {
  test('resp: respGotHits', function(t) {
    var proxy = extractor( function( err, resp ){
      t.equal(err, undefined, 'no error emitted');
      t.equal(typeof resp, 'object', 'object returned');
      t.equal(resp.type, 'node', 'field returned');
      t.equal(resp.center_point.lat, 33.5169579, 'field returned');
      t.equal(resp.center_point.lon, 36.2217176, 'field returned');
      t.end();
    });
    t.equal(typeof proxy, 'function', 'function returned');
    proxy( null, fixtures.get );
  });
}

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('search extractor: ' + name, testFunction)
  }

  for( var testCase in module.exports.extractor ){
    module.exports.extractor[testCase](test, common);
  }
}