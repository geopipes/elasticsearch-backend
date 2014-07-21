
var tape = require('tape');

var common = {};

var tests = [
  require('./interface.js'),
  require('./extractor-fields.js'),
  require('./extractor-mget.js'),
  require('./extractor-search.js'),
  require('./extractor-get.js')
];

tests.map(function(t) {
  t.all(tape, common)
});