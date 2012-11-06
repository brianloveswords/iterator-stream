var test = require('tap').test;
var iterators = require('./iterators');
var istream = require('..');
var StreamString = require('./streamstring');

var fib = iterators.fib;
var letter = iterators.letter;
var natural = iterators.natural;
var falsey = iterators.falsey;
var random = iterators.random;

function inc(x) {
  return ++x;
}

test('fpipe', function (t) {

});

// test('pipelining', function (t) {
//   var iter = natural;

//   var util = require('util');

//   function inc(x) {
//     return ++x;
//   }

//   function even(x) {
//     return x % 2 == 0;
//   }

//   function format(fmt) {
//     return function (x) {
//       return x + '!';
//     }
//   }

//   function takeWhile(fn) {
//     function (x) {
//       if (!fn(x))
//         return null;
//       return true
//     }
//   }

//   function lt(num) {
//     return function (x) {
//       return x < num;
//     }
//   }

//   iterstream(natural())
//     .fpipe(transform(inc))
//     .fpipe(filter(even))
//     .fpipe(format('%s!'))
//     .fpipe(takeWhile( lt(5) ))
//     .pipe(bufferstream(8192))
//     .pipe(process.stdout)

//   t.end();
// });

