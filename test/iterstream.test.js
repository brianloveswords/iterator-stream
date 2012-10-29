var test = require('tap').test;
var iterators = require('./iterators');
var iterstream = require('..');
var StreamString = require('./streamstring');

var fib = iterators.fib;
var letter = iterators.letter;
var natural = iterators.natural;

test('testing regular ol ABCs', function (t) {
  var str = StreamString();
  iterstream(letter(), { separator: null }).pipe(str).once('end', function () {
    t.same(str.value, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    t.end();
  });
});

test('formatting with a string', function (t) {
  var str = StreamString();
  iterstream(letter(), {
    format: '%s|',
    separator: null
  }).pipe(str).once('end', function () {
    t.same(str.value, 'A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z|');
    t.end();
  });
});

test('formatting with a method', function (t) {
  var str = StreamString();
  iterstream(letter(), {
    format: function (l) { return l.toLowerCase(); },
    separator: null,
  }).pipe(str).once('end', function () {
    t.same(str.value, 'abcdefghijklmnopqrstuvwxyz');
    t.end();
  });
});

test('record separator', function (t) {
  var str = StreamString();
  iterstream(letter(), {
    format: '%s',
    separator: '.'
  }).pipe(str).once('end', function () {
    t.same(str.value, 'A.B.C.D.E.F.G.H.I.J.K.L.M.N.O.P.Q.R.S.T.U.V.W.X.Y.Z.');
    t.end();
  });
});
