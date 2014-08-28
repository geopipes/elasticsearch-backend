
var Backend = require('../'),
    through = require('through2');

module.exports.backend = {};

function mockClient( cb ){
  return {
    get:                  cb.bind(this, 'get'),
    mget:                 cb.bind(this, 'mget'),
    index:                cb.bind(this, 'index'),
    search:               cb.bind(this, 'search'),
    bulk:                 cb.bind(this, 'bulk')
  };
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
};

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
};

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
};

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
};

module.exports.backend.createPullStream = function(test, common) {
  test('createPullStream()', function(t) {
    var client = { stream: through.obj(function(){}) };
    var backend = new Backend( client, 'foo', 'bar' );
    var stream = backend.createPullStream();
    t.equal(typeof stream, 'object', 'stream valid');
    t.equal(typeof stream._readableState, 'object', 'stream valid');
    t.end();
  });
};

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
};

module.exports.backend.findAdminHeirachy = function(test, common) {
  test('findAdminHeirachy()', function(t) {

    var client = mockClient( function( method, query, cb ){
      t.equal(method, 'search', 'search called');
      t.equal(typeof query, 'object', 'query generated');
      t.equal(typeof cb, 'function', 'callback provided');
      t.equal(query.index, 'foo', 'query valid');
      t.equal(query.type, 'bar', 'query valid');
      t.equal(query.body.size, 1, 'query valid');
      t.deepEqual(query.body.fields, ['admin0','admin1','admin2'], 'fields');
      t.equal(query.body.query.filtered.filter.bool.must.length, 2, 'strict bool filter');
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
      t.deepEqual(query.body.fields, ['bing','bong'], 'fields');
      t.equal(query.body.query.filtered.filter.bool.must.length, 1, 'no strict bool filter');
      t.end();
    });

    var backend = new Backend( client, 'foo', 'bar' );
    var opts = {
      size: 2,
      fields: ['bing','bong'],
      strict: false
    };
    backend.findAdminHeirachy( { lat: 1, lon: 1 }, opts, function(){} );
  });
};

module.exports.backend.findAdminHeirachyType = function(test, common) {
  test('findAdminHeirachy() - default type', function(t) {
    var client = mockClient( function( method, query, cb ){
      t.equal(method, 'search', 'search called');
      t.equal(typeof query, 'object', 'query generated');
      t.equal(typeof cb, 'function', 'callback provided');
      t.ok(query.body.query.filtered.filter.bool.must[1].hasOwnProperty('geo_distance'), 'distance query');
      t.end();
    });
    var backend = new Backend( client, 'foo', 'bar' );
    backend.findAdminHeirachy( { lat: 1, lon: 1 }, null, function(){} );
  });

  test('findAdminHeirachy() - distance type', function(t) {
    var client = mockClient( function( method, query, cb ){
      t.equal(method, 'search', 'search called');
      t.equal(typeof query, 'object', 'query generated');
      t.equal(typeof cb, 'function', 'callback provided');
      t.ok(query.body.query.filtered.filter.bool.must[1].hasOwnProperty('geo_distance'), 'distance query');
      t.end();
    });
    var backend = new Backend( client, 'foo', 'bar' );
    backend.findAdminHeirachy( { lat: 1, lon: 1 }, { type: 'distance' }, function(){} );
  });

  test('findAdminHeirachy() - shape-point type', function(t) {
    var client = mockClient( function( method, query, cb ){
      t.equal(method, 'search', 'search called');
      t.equal(typeof query, 'object', 'query generated');
      t.equal(typeof cb, 'function', 'callback provided');
      var filter = query.body.query.filtered.filter.bool.must[1];
      t.ok(filter.hasOwnProperty('geo_shape'), 'shape query');
      t.equal(filter.geo_shape.boundaries.shape.type, 'point', 'point type');
      t.end();
    });
    var backend = new Backend( client, 'foo', 'bar' );
    backend.findAdminHeirachy( { lat: 1, lon: 1 }, { type: 'shape-point' }, function(){} );
  });

  test('findAdminHeirachy() - shape-envelope type', function(t) {
    var client = mockClient( function( method, query, cb ){
      t.equal(method, 'search', 'search called');
      t.equal(typeof query, 'object', 'query generated');
      t.equal(typeof cb, 'function', 'callback provided');
      var filter = query.body.query.filtered.filter.bool.must[1];
      t.ok(filter.hasOwnProperty('geo_shape'), 'shape query');
      t.equal(filter.geo_shape.boundaries.shape.type, 'envelope', 'envelope type');
      t.end();
    });
    var backend = new Backend( client, 'foo', 'bar' );
    backend.findAdminHeirachy( { lat: 1, lon: 1 }, { type: 'shape-envelope' }, function(){} );
  });

  test('findAdminHeirachy() - invalid type', function(t) {
    var backend = new Backend( mockClient(function(){}), 'foo', 'bar' );
    backend.findAdminHeirachy( { lat: 1, lon: 1 }, { type: 'foo' }, function( err ){
      t.equal(err, 'invalid type', 'emit error');
      t.end();
    });
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('backend: ' + name, testFunction);
  }

  for( var testCase in module.exports.backend ){
    module.exports.backend[testCase](test, common);
  }
};