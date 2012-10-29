# IteratorStream

An adapter for turning an iterator into a streaming iterator.

# Installation

```bash
npm install iterator-stream
```

# Usage

```js
var itstream = require('iterator-stream');
var natural = { n: 0, next: function() { return this.n++ } };
// In the future when we have ES6 generators: 
//   function* naturalGenerator() { var n = 0; while (1) yield n++; }
//   var natural = naturalGenerator();

itstream(natural).pipe(process.stdout); // spits out natural numbers to stdout
```
