
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
    var coords = must[0].geo_shape.boundaries.shape.coordinates;
    t.equal(coords.lat, '1.11', 'latitude');
    t.equal(coords.lon, '1.22', 'longitude');
    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('reverse-geocode geo_distance query: ' + name, testFunction);
  }

  for( var testCase in module.exports.query ){
    module.exports.query[testCase](test, common);
  }
};