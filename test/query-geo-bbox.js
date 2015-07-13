
var query = require('../query/geo_bbox');

module.exports.query = {};

module.exports.query.generate = function(test, common) {
  test('generate', function(t) {
    var centroid = { lat: 1, lon: 1 };
    var bbox = {
      top   : 1,
      right : 1,
      bottom: 2,
      left  : 2
    };
    var q = query(centroid, { bbox: bbox });
    var must = q.query.filtered.filter.bool.must;
    
    t.equal(Array.isArray(must), true, 'correct bool filter');
    t.equal(must[0]['geo_bounding_box']['center_point']['top'], '1.00', 'correct geo_bbox top vertice filter value');
    t.equal(must[0]['geo_bounding_box']['center_point']['right'], '1.00', 'correct geo_bbox right vertice filter value');
    t.equal(must[0]['geo_bounding_box']['center_point']['bottom'], '2.00', 'correct geo_bbox bottom vertice filter value');
    t.equal(must[0]['geo_bounding_box']['center_point']['left'], '2.00', 'correct geo_bbox left vertice filter value');
    t.equal(must[0]['geo_bounding_box']['_cache'], true, 'query caching enabled');
    t.equal(must[0]['geo_bounding_box']['type'], 'indexed', 'query type set to indexed');
    t.deepEqual( q.sort, ['_score'], 'should not sort results by distance from centroid' );

    t.end();
  });
};

module.exports.query.generateWithNoCentroid = function(test, common) {
  test('generate without centroid', function(t) {
    var centroid = null;
    var bbox = {
      top   : 1,
      right : 1,
      bottom: 2,
      left  : 2
    };
    var q = query(centroid, { bbox: bbox });
    var must = q.query.filtered.filter.bool.must;
    
    t.equal(Array.isArray(must), true, 'correct bool filter');
    t.equal(must[0]['geo_bounding_box']['center_point']['top'], '1.00', 'correct geo_bbox top vertice filter value');
    t.equal(must[0]['geo_bounding_box']['center_point']['right'], '1.00', 'correct geo_bbox right vertice filter value');
    t.equal(must[0]['geo_bounding_box']['center_point']['bottom'], '2.00', 'correct geo_bbox bottom vertice filter value');
    t.equal(must[0]['geo_bounding_box']['center_point']['left'], '2.00', 'correct geo_bbox left vertice filter value');
    t.equal(must[0]['geo_bounding_box']['_cache'], true, 'query caching enabled');
    t.equal(must[0]['geo_bounding_box']['type'], 'indexed', 'query type set to indexed');
    t.deepEqual( q.sort, ['_score'], 'should not sort results by distance from centroid' );

    t.end();
  });
};

module.exports.query.enableGeoSorting = function(test, common) {
  test('geo sorting enabled', function(t) {
    var centroid = { lat: 1, lon: 1 };
    var bbox = {
      top   : 1,
      right : 1,
      bottom: 2,
      left  : 2
    };
    var q = query(centroid, { bbox: bbox, sort: true });
    t.equal(q.sort[1]['_geo_distance']['center_point'], centroid, 'correct sort condition');
    t.end();
  });
}

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('reverse-geocode geo_bbox query: ' + name, testFunction);
  }

  for( var testCase in module.exports.query ){
    module.exports.query[testCase](test, common);
  }
};
