var test = require('tap').test;
var iterators = require('./iterators');
var istream = require('..');
var pipeline = require('../fpipe');
var StreamString = require('./streamstring');
var Stream = require('stream');
var fib = iterators.fib;
var letter = iterators.letter;
var natural = iterators.natural;
var falsey = iterators.falsey;
var random = iterators.random;

function inc(x) {
  return ++x;
}
function mod(x) {
  return x % 2;
}
function take(num) {
  return function () {
    return (--num >= 0);
  }
}
function even(x) {
  return x % 2 == 0;
}
function elem(x) {
  return function (obj) { return obj[x] }
}

function format(fmt) {
  return function(x) {
    return require('util').format(fmt, x);
  }
}
function filter() {  }

test('pipeline basic', function (t) {
  var DATABASE = [
    {first: 'Steve', last: 'Doucheman', age: 44},
    {first: 'Bill', last: 'Paxton', age: 12},
    {first: 'Rich', last: 'Martin', age: 19},
    {first: 'Timm', last: 'Glisdao', age: 18},
    {first: 'Ilde', last: 'Yolsla', age: 13},
    {first: 'Usne', last: 'Lados', age: 32},
  ];

  function databaseCall(callback) {
    process.nextTick(function () {
      callback(null, DATABASE);
    });
  }

  var alaska = pipeline(databaseCall);
  alaska
    .fpipe(pipeline.disperse)
    .fpipe(elem('first'))
    .fpipe(format('%s!\n'))
    .fpipe(process.stdout);
  alaska.begin()

  t.end();
});
