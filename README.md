# IteratorStream [![Build Status](https://secure.travis-ci.org/brianloveswords/iterator-stream.png)](http://travis-ci.org/brianloveswords/iterator-stream)

An adapter for turning an iterator into a streaming iterator.

# Installation

```bash
$ npm install iterator-stream
```

# Basic Usage

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

# Advanced Usage

```
itstream(iterator, options);
```

## Options
- `separator`: A string added to the end of each computation before
  emitting. Defaults to `\n'`. Pass `null` to disable.
- `format`: Can be a method or a format string that will be passed to
  `util.format`. Defaults to `'%s'`. If given a function, it will be
  called like `formatFn(value)` where value is the raw output of the
  calculation.
- `bufferSize`: By default each result will be emitted as it is
  computed. If the resulting computations are small, this could be
  inefficient. If you pass a `bufferSize`, it will buffer **at least**
  that many bytes before emitting a data event.
- `condition`: An optional condition function to run against the output
  of every computation. If this check fails, no more data will be send
  and an `end` event will be emitted. Useful for infinite iterators.
- `iterations`: Maximum number of iterations to go through before
  `end`ing. Defaults to Infinity.
