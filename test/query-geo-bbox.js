
var query = require('../query/geo_bbox');

module.exports.query = {};

module.exports.query.generate = function(test, common) {
  test('generate', function(t) {
    var centroid = { lat: 1, lon: 1 };
    var bbox = [1,1,2,2];
    var q = query(centroid, { bbox: bbox });
    var must = q.query.filtered.filter.bool.must;
    
    t.equal(Array.isArray(must), true, 'correct bool filter');
    t.equal(must[0]['geo_bounding_box']['center_point']['top_right'].lat, '1.00', 'correct geo_bbox top_right filter value');
    t.equal(must[0]['geo_bounding_box']['center_point']['top_right'].lon, '1.00', 'correct geo_bbox top_right filter value');
    t.equal(must[0]['geo_bounding_box']['center_point']['bottom_left'].lat, '2.00', 'correct geo_bbox bottom_left filter value');
    t.equal(must[0]['geo_bounding_box']['center_point']['bottom_left'].lon, '2.00', 'correct geo_bbox bottom_left filter value');
    t.end();
  });
}

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('reverse-geocode geo_bbox query: ' + name, testFunction)
  }

  for( var testCase in module.exports.query ){
    module.exports.query[testCase](test, common);
  }
}