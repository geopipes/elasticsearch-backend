
var tape = require('tape');

var common = {};

var tests = [
  require('./interface.js'),
  require('./extractor-fields.js'),
  require('./extractor-mget.js')
];

tests.map(function(t) {
  t.all(tape, common)
});