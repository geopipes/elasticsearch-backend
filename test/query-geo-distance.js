
var query = require('../query/geo_distance');

module.exports.query = {};

module.exports.query.generate = function(test, common) {
  test('generate', function(t) {
    var centroid = { lat: 1, lon: 1 };
    var q = query(centroid, { distance: '999km' });
    var must = q.query.filtered.filter.bool.must;
    
    t.equal(Array.isArray(must), true, 'correct bool filter');
    t.equal(must[0]['geo_distance']['distance'], '999km', 'correct geo_distance filter');
    t.equal(must[0]['geo_distance']['center_point'].lat, '1.00', 'correct geo_distance filter');
    t.equal(must[0]['geo_distance']['center_point'].lon, '1.00', 'correct geo_distance filter');
    t.deepEqual( q.sort, ['_score'], 'should not sort results by distance from centroid' );
    t.end();
  });
}

module.exports.query.generateWithNoCentroid = function(test, common) {
  test('generate with null centroid', function(t) {
    var centroid = null;
    var q = query(centroid, { distance: '999km' });
    var must = q.query.filtered.filter.bool.must;
    
    t.equal(Array.isArray(must), true, 'correct bool filter');
    t.equal(must.length, 0, 'no geo_distance filter set');
    t.deepEqual( q.sort, ['_score'], 'should not sort results by distance from centroid' );
    t.end();
  });
}

module.exports.query.enableGeoSorting = function(test, common) {
  test('geo sorting enabled', function(t) {
    var centroid = { lat: 1, lon: 1 };
    var q = query(centroid, { distance: '999km', sort: true });
    t.equal(q.sort[1]['_geo_distance']['center_point'], centroid, 'correct sort condition');
    t.end();
  });
}

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('reverse-geocode geo_distance query: ' + name, testFunction)
  }

  for( var testCase in module.exports.query ){
    module.exports.query[testCase](test, common);
  }
}