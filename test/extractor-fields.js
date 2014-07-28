
var extractor = require('../extractor/fields');
var fixtures = require('./fixtures/_index');

module.exports.extractor = {};

module.exports.extractor.invalidFields = function(test, common) {
  test('constructor: invalidFields', function(t) {
    try {
      var proxy = extractor( null, function(){} );
    }
    catch (e){
      t.equal(e.message, 'invalid fields supplied', 'exception thrown');
      t.end();
    }
  });
  test('constructor: emptyFields', function(t) {
    try {
      var proxy = extractor( [], function(){} );
    }
    catch (e){
      t.equal(e.message, 'invalid fields supplied', 'exception thrown');
      t.end();
    }
  });
  test('constructor: invalidCallback', function(t) {
    var proxy = extractor( ['foo'] );
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
    var proxy = extractor( ['foo','bar'], function( err, resp ){
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
    var proxy = extractor( ['foo'], function( err, resp ){
      t.equal(err, undefined, 'no error emitted');
      t.equal(resp, undefined, 'no result returned');
      t.end();
    });
    t.equal(typeof proxy, 'function', 'function returned');
    proxy(); // no hits
  });
}

// Failed to find any fields matching 'foo'
module.exports.extractor.respGotHits = function(test, common) {
  test('resp: respGotHits', function(t) {
    var proxy = extractor( ['foo'], function( err, resp ){
      t.equal(err, undefined, 'no error emitted');
      t.equal(Array.isArray(resp), true, 'array returned');
      t.equal(resp.length, 0, 'array contains 0 records');
      t.end();
    });
    t.equal(typeof proxy, 'function', 'function returned');
    proxy( null, fixtures.fields );
  });
}

// Matched all fields
module.exports.extractor.respGotHits = function(test, common) {
  test('resp: respGotHits', function(t) {
    var proxy = extractor( ['admin0','admin1','admin2'], function( err, resp ){
      t.equal(err, undefined, 'no error emitted');
      t.equal(Array.isArray(resp), true, 'array returned');
      t.equal(resp.length, 1, 'array contains 1 record');
      t.equal(resp[0]._id, '6289144', 'field returned');
      t.equal(resp[0]._index, 'pelias', 'field returned');
      t.equal(resp[0]._type, 'geoname', 'field returned');
      t.equal(resp[0].admin0, 'United Kingdom', 'field returned');
      t.equal(resp[0].admin1, 'England', 'field returned');
      t.equal(resp[0].admin2, 'Greater London', 'field returned');
      t.end();
    });
    t.equal(typeof proxy, 'function', 'function returned');
    proxy( null, fixtures.fields );
  });
}

module.exports.extractor.respFailedHits = function(test, common) {
  test('resp: respFailedHits', function(t) {
    var proxy = extractor( ['admin0','admin1','admin2'], function( err, resp ){
      t.equal(err, 'invalid fields returned', 'error emitted');
      t.equal(resp, undefined, 'no results returned');
      t.end();
    });
    t.equal(typeof proxy, 'function', 'function returned');
    proxy( null, fixtures.failedFields );
  });
}

module.exports.extractor.genericFailure = function(test, common) {
  test('resp: genericFailure', function(t) {
    var proxy = extractor( ['foo'], function( err, resp ){
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
    return tape('fields extractor: ' + name, testFunction)
  }

  for( var testCase in module.exports.extractor ){
    module.exports.extractor[testCase](test, common);
  }
}