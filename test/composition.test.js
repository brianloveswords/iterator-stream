var domain = require('domain');
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

function filter(conditionFn) {
  return function () {
    var bool = conditionFn.apply(conditionFn, arguments);
    if (bool)
      this.send.apply(this, arguments);
  }
}

test('pipelining', function (t) {
  var strs = new StreamString();
  var alaska = pipeline(databaseCall);
  var expect = 'Steve!\nBill!\nRich!\nTimm!\nIlde!\nUsne!\n';
  alaska
    .fpipe(pipeline.disperse)
    .fpipe(elem('first'))
    .fpipe(format('%s!\n'))
    .fpipe(strs)
    .on('end', function () {
      t.same(strs.value, expect);
    })
  alaska.begin()


  t.end();
});
