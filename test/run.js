
var tape = require('tape');

var common = {};

var tests = [
  require('./interface.js'),
  require('./backend.js'),
  require('./extractor-fields.js'),
  require('./extractor-mget.js'),
  require('./extractor-search.js'),
  require('./extractor-get.js'),
  require('./extractor-put.js'),
  require('./query-geobase.js'),
  require('./query-geo-distance.js'),
  require('./query-geo-bbox.js'),
  require('./query-geohash-cell.js'),
  require('./query-geo-shape-point.js'),
  require('./query-geo-shape-envelope.js')
];

tests.map(function(t) {
  t.all(tape, common);
});