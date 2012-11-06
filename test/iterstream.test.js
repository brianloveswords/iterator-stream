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
  iterstream(letter()).pipe(str).once('end', function () {
    t.same(str.value, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    t.end();
  });
});

test('formatting with a string', function (t) {
  var str = StreamString();
  iterstream(letter(), {
    format: '%s|',
  }).pipe(str).once('end', function () {
    t.same(str.value, 'A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z|');
    t.end();
  });
});

test('formatting with a method', function (t) {
  var str = StreamString();
  iterstream(letter(), {
    format: function (l) { return l.toLowerCase(); },
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

test('takeWhile', function (t) {
  var str = StreamString();
  iterstream(letter(), {
    takeWhile: function (value) { return value < 'D'; }
  }).pipe(str).once('end', function () {
    t.same(str.value, 'ABC');
    t.end();
  });
});

test('buffering stuff', function (t) {
  var str = StreamString();
  iterstream(fib(), {
    bufferSize: 8192
  }).pipe(str).once('end', function () {
    t.ok(str.events[0].size >= 8192, 'should have buffered the send');
    t.ok(str.value.indexOf('1.3069892237633987e+308') > -1, 'should have the last event');
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
  iterstream(natural(), {
    transform: function (v) { return 'hi' },
    iterations: 3,
  }).pipe(str).once('end', function () {
    t.same(str.value, 'hihihi');
    t.end();
  });
});


test('filter option', function (t) {
  var str = StreamString();
  iterstream(natural(), {
    filter: function (v) { return v % 2 == 0 },
    takeWhile: function (v) { return v <= 10 },
  }).pipe(str).once('end', function () {
    t.same(str.value, '0246810');
    t.end();
  });
});

test('take option', function (t) {
  var str = StreamString();
  iterstream(natural(), {
    take: 5,
  }).pipe(str).once('end', function () {
    t.same(str.value, '01234');
    t.end();
  });
});
