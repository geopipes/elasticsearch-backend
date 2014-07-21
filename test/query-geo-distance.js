
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