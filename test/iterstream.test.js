var test = require('tap').test;
var iterators = require('./iterators');
var iterstream = require('..');
var StreamString = require('./streamstring');

var fib = iterators.fib();
var letter = iterators.letter();
var natural = iterators.natural();

test('testing regular ol ABCs', function (t) {
  var str = StreamString();
  iterstream(letter).pipe(str).once('end', function () {
    t.same(str.value, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    t.end();
  });
});

