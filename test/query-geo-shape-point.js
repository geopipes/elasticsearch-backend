
var query = require('../query/geo_shape_point');

module.exports.query = {};

module.exports.query.generate = function(test, common) {
  test('generate', function(t) {
    var centroid = { lat: 1.1111, lon: 1.2222 };
    var q = query(centroid, { distance: '999km' });
    var must = q.query.filtered.filter.bool.must;

    t.equal(Array.isArray(must), true, 'correct bool filter');
    t.equal(must[0].geo_shape.boundaries.relation, 'intersects', 'relation');
    t.equal(must[0].geo_shape.boundaries.shape.type, 'point', 'shape type');
    t.deepEqual( q.sort, ['_score'], 'should not sort results by distance from centroid' );

    // co-ordinates MUST be specified in Array syntax
    var coords = must[0].geo_shape.boundaries.shape.coordinates;
    t.deepEqual(coords, [1.2222,1.1111], 'lon/lat');
    t.end();
  });
};

module.exports.query.enableGeoSorting = function(test, common) {
  test('geo sorting enabled', function(t) {
    var centroid = { lat: 1.1111, lon: 1.2222 };
    var q = query(centroid, { distance: '999km', sort: true });
    t.equal(q.sort[1]['_geo_distance']['center_point'], centroid, 'correct sort condition');
    t.end();
  });
}

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('reverse-geocode geo_shape_point query: ' + name, testFunction);
  }

  for( var testCase in module.exports.query ){
    module.exports.query[testCase](test, common);
  }
};