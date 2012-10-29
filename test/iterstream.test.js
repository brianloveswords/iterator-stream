var test = require('tap').test;
var iterators = require('./iterators');
var iterstream = require('..');

var fib = iterators.fib();
var letter = iterators.letter();
var natural = iterators.natural();

test('testing regular ol fib', function (t) {
  iterstream(fib).pipe(process.stdout);
  t.end();
});

