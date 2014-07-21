
var tape = require('tape');

var common = {};

var tests = [
  require('./interface.js'),
  require('./backend.js'),
  require('./extractor-fields.js'),
  require('./extractor-mget.js'),
  require('./extractor-search.js'),
  require('./extractor-get.js'),
  require('./extractor-put.js')
];

tests.map(function(t) {
  t.all(tape, common)
});