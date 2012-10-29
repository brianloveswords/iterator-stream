var util = require('util');
var Stream = require('stream');

function IterStream(iter, options) {
  this.format = options.format || '%s';
  this.separator = typeof options.separator === 'undefined'
    ? '\n'
    : (options.separator || '');
  if (typeof this.format === 'function')
    this.formatOutput = this.format;
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
  var data, formatted;
  while (!this.paused && (data = this.iter.next())) {
    formatted = this.formatOutput(data);
    formatted += this.separator;
    this.emit('data', formatted);
  }
  if (data === null)
    this.emit('end');
};
IterStream.prototype.formatOutput = function formatOutput(data) {
  return util.format(this.format, data);
};

module.exports = function iterstreamAdapter(iter, options) {
  options = options || {};
  return new IterStream(iter, options);
};