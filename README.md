# IteratorStream v0.4.0 [![Build Status](https://secure.travis-ci.org/brianloveswords/iterator-stream.png)](http://travis-ci.org/brianloveswords/iterator-stream)
[Changelog](https://github.com/brianloveswords/iterator-stream/blob/master/CHANGELOG.md)

An adapter for turning an iterator into a streaming iterator.

## Installation

```bash
$ npm install iterator-stream
```

## Basic Usage

```js
var itstream = require('iterator-stream');
var natural = { n: 0, next: function() { return this.n++ } };
// In the future when we have ES6 generators: 
//   function* naturalGenerator() { var n = 0; while (1) yield n++; }
//   var natural = naturalGenerator();

itstream(natural).pipe(process.stdout); // spits out natural numbers to stdout
```

In the case of a non-infinite iteration, `end` will be emitted when the
iterator either returns `null` from `next()` or if `next()` throws an
error with the name `StopIteration`. Any other errors will cause the
stream to emit an `error` event.

Note that it doesn't have to call `next()`! See `method` below.

## Advanced Usage

### Options
- `separator`: A string added to the end of each computation before
  emitting. 

- `format`: Can be a method or a format string that will be passed to
  `util.format`. Defaults to `'%s'`. If given a function, it will be
  called like `formatFn(value)` where value is the raw output of the
  calculation.

- `bufferSize`: By default each result will be emitted as it is
  computed. If the resulting computations are small, this could be
  inefficient. If you pass a `bufferSize`, it will buffer **at least**
  that many bytes before emitting a data event.

- `takeWhile`: An optional condition function to run against the output
  of every computation. If this check fails, no more data will be send
  and an `end` event will be emitted. Useful for infinite iterators.

- `iterations`: Maximum number of iterations to go through before
  `end`ing.

- `take`: How many items to take before calling it quits. This is
  different from iterations when a filter is passed – `take` is
  counted post-filter, `iterations` is pre-filter.

- `method`: Name of the method to call over and over again. Defaults to
  `"next"`

- `transform`: A method to run on every (non-null) value coming from the
  iterator. Defaults to `function (x) { return x }`

#### Application Order
```
transform → takeWhile → [check iterations] → filter → [check take] → format → emit
```

### Example

```js
var stream = itstream(iterator, {
  separator: '-' // separate entries with a dash
  format: '¡%s!' // get real excited about it
  bufferSize: 8*1024 // buffer 8kb before sending
  takeWhile: function(v) { return v < Infinity } // stop if the value hits infinity,
  iterations: 1476 // stop after 1476 iterations
});

// note that iteration will not start until the next tick after piping,
// so it's safe to set this up before any callbacks

setTimeout(function(){
  stream.pipe(process.stdout);
}, 2500);
```
