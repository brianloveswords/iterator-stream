var util = require('util');
var Stream = require('stream');

function IterStream(iter, options) {
  this.iter = iter;
}
util.inherits(IterStream, Stream);

IterStream.prototype.pipe = function pipe(endpoint) {
  process.nextTick(this.resume.bind(this));
  return Stream.prototype.pipe.call(this, endpoint);
};
IterStream.prototype.pause = function pause() {
  this.paused = true;
};
IterStream.prototype.resume = function resume() {
  this.paused = false;
  var data;
  while (!this.paused && (data = this.iter.next())) {
    this.emit('data', data.toString());
  }
  if (data === null)
    this.emit('end');
};

module.exports = function iterstreamAdapter(iter, options) {
  options = options || {};
  return new IterStream(iter);
};