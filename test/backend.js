
var Backend = require('../');

module.exports.backend = {};

function mockClient( cb ){
  return {
    get:                  cb.bind(this, 'get'),
    mget:                 cb.bind(this, 'mget'),
    index:                cb.bind(this, 'index'),
    search:               cb.bind(this, 'search'),
    bulk:                 cb.bind(this, 'bulk')
  }
}

module.exports.backend.get = function(test, common) {
  test('get()', function(t) {

    var client = mockClient( function( method, query, cb ){
      t.equal(method, 'get', 'get called');
      t.equal(typeof query, 'object', 'query generated');
      t.equal(typeof cb, 'function', 'callback provided');
      t.equal(query.index, 'foo', 'query valid');
      t.equal(query.type, 'bar', 'query valid');
      t.equal(query.id, 1, 'query valid');
      t.end();
    });

    var backend = new Backend( client, 'foo', 'bar' );
    backend.get( 1, null, function(){} );
  });
}

module.exports.backend.mget = function(test, common) {
  test('mget()', function(t) {

    var client = mockClient( function( method, query, cb ){
      t.equal(method, 'mget', 'mget called');
      t.equal(typeof query, 'object', 'query generated');
      t.equal(typeof cb, 'function', 'callback provided');
      t.equal(query.index, 'foo', 'query valid');
      t.equal(query.type, 'bar', 'query valid');
      t.equal(query.body.ids[0], 1, 'query valid');
      t.end();
    });

    var backend = new Backend( client, 'foo', 'bar' );
    backend.mget( [1], null, function(){} );
  });
}

module.exports.backend.put = function(test, common) {
  test('put()', function(t) {

    var client = mockClient( function( method, query, cb ){
      t.equal(method, 'index', 'index called');
      t.equal(typeof query, 'object', 'query generated');
      t.equal(typeof cb, 'function', 'callback provided');
      t.equal(query.index, 'foo', 'query valid');
      t.equal(query.type, 'bar', 'query valid');
      t.equal(query.body, 'hello', 'query valid');
      t.end();
    });

    var backend = new Backend( client, 'foo', 'bar' );
    backend.put( 1, 'hello', null, function(){} );
  });
}

module.exports.backend.search = function(test, common) {
  test('search()', function(t) {

    var client = mockClient( function( method, query, cb ){
      t.equal(method, 'search', 'search called');
      t.equal(typeof query, 'object', 'query generated');
      t.equal(typeof cb, 'function', 'callback provided');
      t.equal(query.index, 'foo', 'query valid');
      t.equal(query.type, 'bar', 'query valid');
      t.equal(query.body.query, 'hello', 'query valid');
      t.end();
    });

    var backend = new Backend( client, 'foo', 'bar' );
    backend.search( { query: 'hello' }, null, function(){} );
  });
}

module.exports.backend.createPullStream = function(test, common) {
  test('createPullStream()', function(t) {
    var backend = new Backend( function(){}, 'foo', 'bar' );
    var stream = backend.createPullStream();
    t.equal(typeof stream, 'object', 'stream valid');
    t.equal(typeof stream._readableState, 'object', 'stream valid');
    t.end();
  });
}

module.exports.backend.reverseGeo = function(test, common) {
  test('reverseGeo()', function(t) {

    var client = mockClient( function( method, query, cb ){
      t.equal(method, 'search', 'search called');
      t.equal(typeof query, 'object', 'query generated');
      t.equal(typeof cb, 'function', 'callback provided');
      t.equal(query.index, 'foo', 'query valid');
      t.equal(query.type, 'bar', 'query valid');
      t.equal(query.body.size, 1, 'query valid');
      t.end();
    });

    var backend = new Backend( client, 'foo', 'bar' );
    backend.reverseGeo( { lat: 1, lon: 1 }, null, function(){} );
  });
  test('reverseGeo() - override opts', function(t) {

    var client = mockClient( function( method, query, cb ){
      t.equal(method, 'search', 'search called');
      t.equal(typeof query, 'object', 'query generated');
      t.equal(typeof cb, 'function', 'callback provided');
      t.equal(query.body.size, 2, 'query valid');
      t.end();
    });

    var backend = new Backend( client, 'foo', 'bar' );
    backend.reverseGeo( { lat: 1, lon: 1 }, { size: 2 }, function(){} );
  });
}


module.exports.backend.findAdminHeirachy = function(test, common) {
  test('findAdminHeirachy()', function(t) {

    var client = mockClient( function( method, query, cb ){
      t.equal(method, 'search', 'search called');
      t.equal(typeof query, 'object', 'query generated');
      t.equal(typeof cb, 'function', 'callback provided');
      t.equal(query.index, 'foo', 'query valid');
      t.equal(query.type, 'bar', 'query valid');
      t.equal(query.body.size, 1, 'query valid');
      t.end();
    });

    var backend = new Backend( client, 'foo', 'bar' );
    backend.findAdminHeirachy( { lat: 1, lon: 1 }, null, function(){} );
  });
  test('findAdminHeirachy() - override opts', function(t) {

    var client = mockClient( function( method, query, cb ){
      t.equal(method, 'search', 'search called');
      t.equal(typeof query, 'object', 'query generated');
      t.equal(typeof cb, 'function', 'callback provided');
      t.equal(query.body.size, 2, 'query valid');
      t.end();
    });

    var backend = new Backend( client, 'foo', 'bar' );
    backend.findAdminHeirachy( { lat: 1, lon: 1 }, { size: 2 }, function(){} );
  });
}

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('backend: ' + name, testFunction)
  }

  for( var testCase in module.exports.backend ){
    module.exports.backend[testCase](test, common);
  }
}