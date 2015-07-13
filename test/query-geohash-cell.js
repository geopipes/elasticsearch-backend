
var query = require('../query/geohash_cell');

module.exports.query = {};

module.exports.query.generate = function(test, common) {
  test('generate', function(t) {
    var centroid = { lat: 1, lon: 1 };
    var q = query(centroid, { distance: '999km' });
    var must = q.query.filtered.filter.bool.must;
    
    t.equal(Array.isArray(must), true, 'correct bool filter');
    t.equal(must[0]['geohash_cell']['neighbors'], true, 'correct geohash_cell filter');
    t.deepEqual( q.sort, ['_score'], 'should not sort results by distance from centroid' );

    t.end();
  });
}

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('reverse-geocode geohash_cell query: ' + name, testFunction)
  }

  for( var testCase in module.exports.query ){
    module.exports.query[testCase](test, common);
  }
}