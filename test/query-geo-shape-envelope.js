
var query = require('../query/geo_shape_envelope');

module.exports.query = {};

module.exports.query.generate = function(test, common) {
  test('generate', function(t) {
    var points = [ [100.5, 0.5], [100.5, 0.5] ];
    var q = query(points, { distance: '999km' });
    var must = q.query.filtered.filter.bool.must;

    t.equal(Array.isArray(must), true, 'correct bool filter');
    t.equal(must[0].geo_shape.boundaries.relation, 'intersects', 'relation');
    t.equal(must[0].geo_shape.boundaries.shape.type, 'envelope', 'shape type');
    t.deepEqual( q.sort, ['_score'], 'should not sort results by distance from centroid' );

    // co-ordinates MUST be specified in Array syntax
    var coords = must[0].geo_shape.boundaries.shape.coordinates;
    t.deepEqual(coords, points, 'lon/lat');
    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('reverse-geocode geo_shape_envelope query: ' + name, testFunction);
  }

  for( var testCase in module.exports.query ){
    module.exports.query[testCase](test, common);
  }
};