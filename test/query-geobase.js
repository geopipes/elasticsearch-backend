
var query = require('../query/geo_base');

module.exports.query = {};

module.exports.query.generate = function(test, common) {
  test('generate', function(t) {
    var q = query({size: 2});
    t.equal(q.size, 2, 'valid function'); // opt override working
    t.equal(typeof q.query.filtered.query.match_all, 'object', 'correct match condition');
    t.equal(Array.isArray(q.query.filtered.filter.bool.must), true, 'correct bool filter');
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