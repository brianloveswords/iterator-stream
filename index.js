var util = require('util');
var Stream = require('stream');

function alwaysTrue() { return true };
function IterStream(iter, options) {
  this.buffer = '';
  this.iterations = options.iterations || Infinity;
  this.bufferSize = options.bufferSize || 0;
  this.condition = options.condition || alwaysTrue;
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
  var formatted;
  var data = this.next();
  while (!this.paused && this.continuable(data)) {
    formatted = this.formatOutput(data);
    formatted += this.separator;
    this.emitDataEvent(formatted);
    data = this.next();
  }
  if (data === null || !this.continuable(data))
    this.emitEndEvent();
};

IterStream.prototype.continuable = function continuable(data) {
  return data !== null && this.condition(data) && --this.iterations >= 0;
};

IterStream.prototype.next = function next() {
  var value;
  try {
    value = this.iter.next();
  } catch(err) {
    if (err.name === 'StopIteration')
      value = null;
    else {
      this.pause();
      this.emit('error', err);
    }
  }
  return value;
};

IterStream.prototype.formatOutput = function formatOutput(data) {
  return util.format(this.format, data);
};

IterStream.prototype.emitDataEvent = function emitDataEvent(data) {
  this.buffer += data;
  if (this.buffer.length >= this.bufferSize)
    this.emitBuffer();
};

IterStream.prototype.emitEndEvent = function emitEndEvent() {
  if (this.buffer.length)
    this.emitBuffer();
  this.emit('end');
};

IterStream.prototype.emitBuffer = function sendBuffer() {
  this.emit('data', this.buffer);
  this.buffer = '';
};

module.exports = function iterstreamAdapter(iter, options) {
  options = options || {};
  return new IterStream(iter, options);
};