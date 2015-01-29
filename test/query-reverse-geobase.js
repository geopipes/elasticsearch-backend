
var query = require('../query/reverse_geo_base');

module.exports.query = {};

module.exports.query.generate = function(test, common) {
  test('generate', function(t) {
    var centroid = { lat: 1, lon: 1 };
    var q = query(centroid, {size: 2});
    t.equal(q.size, 2, 'valid function'); // opt override working
    t.equal(typeof q.query.filtered.query.match_all, 'object', 'correct match condition');
    t.equal(Array.isArray(q.query.filtered.filter.bool.must), true, 'correct bool filter');
    t.equal(q.sort[0]['_geo_distance']['center_point'], centroid, 'correct sort condition');
    t.end();
  });
}

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('reverse-geocode base query: ' + name, testFunction)
  }

  for( var testCase in module.exports.query ){
    module.exports.query[testCase](test, common);
  }
}