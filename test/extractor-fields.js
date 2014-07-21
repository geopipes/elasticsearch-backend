
var extractor = require('../extractor/fields');
var fixtures = { fields: require('./fixtures/fieldsQuery') }

module.exports.extractor = {};

module.exports.extractor.invalidFields = function(test, common) {
  test('constructor: invalidFields', function(t) {
    var proxy = extractor( null, function( err, resp ){
      t.equal(typeof err, 'string', 'error emitted');
      t.equal(err, 'invalid fields supplied', err);
      t.end();
    });
    t.equal(typeof proxy, 'function', 'function returned');
    proxy();
  });
  test('constructor: emptyFields', function(t) {
    var proxy = extractor( [], function( err, resp ){
      t.equal(typeof err, 'string', 'error emitted');
      t.equal(err, 'invalid fields supplied', err);
      t.end();
    });
    t.equal(typeof proxy, 'function', 'function returned');
    proxy();
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
      t.equal(resp[0].admin0, 'United Kingdom', 'field returned');
      t.equal(resp[0].admin1, 'England', 'field returned');
      t.equal(resp[0].admin2, 'Greater London', 'field returned');
      t.end();
    });
    t.equal(typeof proxy, 'function', 'function returned');
    proxy( null, fixtures.fields );
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