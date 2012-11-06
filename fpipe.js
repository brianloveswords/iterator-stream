const Stream = require('stream');
module.exports = function fpipe(fn) {
  var stream = new Stream;
  stream.writable = true;
  stream.write = function write(v) {
    this.emit('data', fn(v));
  }
  stream.end = stream.write;
  return stream;
};
