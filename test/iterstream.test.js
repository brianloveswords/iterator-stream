var test = require('tap').test;
var iterators = require('./iterators');
var iterstream = require('..');
var StreamString = require('./streamstring');

var fib = iterators.fib;
var letter = iterators.letter;
var natural = iterators.natural;
var falsey = iterators.falsey;
var random = iterators.random;

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

test('additional condition', function (t) {
  var str = StreamString();
  iterstream(letter(), {
    condition: function (value) { return value < 'D'; }
  }).pipe(str).once('end', function () {
    t.same(str.value, 'A\nB\nC\n');
    t.end();
  });
});

test('buffering stuff', function (t) {
  var str = StreamString();
  iterstream(fib(), {
    bufferSize: 8192
  }).pipe(str).once('end', function () {
    t.ok(str.events[0].size >= 8192, 'should have buffered the send');
    t.same(str.value.indexOf('1.3069892237633987e+308\n'), 32907, 'should have the last event');
    t.end();
  });
});

test('iterations option', function (t) {
  var str = StreamString();
  iterstream(falsey(), {
    iterations: 10
  }).pipe(str).once('end', function () {
    t.same(str.events.length, 10, 'should have ten events');
    t.end();
  });
});

test('method option', function (t) {
  var str = StreamString();
  iterstream(random(), {
    iterations: 10,
    method: 'random',
  }).pipe(str).once('end', function () {
    t.same(str.events.length, 10, 'should have ten events');
    t.end();
  });
});

test('transform option', function (t) {
  var str = StreamString();
  iterstream(random(), {
    transform: function(v) { return 'hi' },
    iterations: 3,
    method: 'random',
    separator: '',
  }).pipe(str).once('end', function () {
    t.same(str.value, 'hihihi');
    t.end();
  });
});
