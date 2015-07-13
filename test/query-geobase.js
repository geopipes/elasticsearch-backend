
var query = require('../query/geo_base');

module.exports.query = {};

module.exports.query.generate = function(test, common) {
  test('generate', function(t) {
    var q = query(null, {size: 2});
    t.equal(q.size, 2, 'valid function'); // opt override working
    t.equal(typeof q.query.filtered.query.match_all, 'object', 'correct match condition');
    t.equal(Array.isArray(q.query.filtered.filter.bool.must), true, 'correct bool filter');
    t.deepEqual( q.sort, ['_score'], 'should not sort results by distance from centroid' );
    t.end();
  });
}

// sort results by their distance from the input centroid
module.exports.query.generate_with_sort = function(test, common) {
  test('generate with sort', function(t) {
    var centroid = { lat: 1, lon: 1 };
    var q = query(centroid, {size: 2, sort: true});
    t.equal(q.size, 2, 'valid function'); // opt override working
    t.equal(typeof q.query.filtered.query.match_all, 'object', 'correct match condition');
    t.equal(Array.isArray(q.query.filtered.filter.bool.must), true, 'correct bool filter');
    t.equal(q.sort[1]['_geo_distance']['center_point'], centroid, 'correct sort condition');
    t.end();
  });
}

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('geocode base query: ' + name, testFunction)
  }

  for( var testCase in module.exports.query ){
    module.exports.query[testCase](test, common);
  }
}