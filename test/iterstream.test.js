var test = require('tap').test;
var iterators = require('./iterators');
var iterstream = require('..');
var StreamString = require('./streamstring');

var fib = iterators.fib();
var letter = iterators.letter();
var natural = iterators.natural();

test('testing regular ol ABCs', function (t) {
  var str = StreamString();
  var istream = iterstream(letter);
  istream.pipe(str);
  istream.once('end', function () {
    t.same(str.value, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    t.end();
  });
});

