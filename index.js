var util = require('util');
var Stream = require('stream');

function identity(x) { return x };

function alwaysTrue() { return true };

function isDefined(s) {
  return (typeof s !== undefined && s !== null && s !== '');
}

function IterStream(iter, options) {
  this.buffer = '';
  this.iterations = options.iterations || Infinity;
  this.take = options.take || Infinity;

  this.method = options.method || 'next';
  this.bufferSize = options.bufferSize || 0;

  this.takeWhile = options.takeWhile || options.condition || alwaysTrue;
  this.transform = options.transform || identity;
  this.filter = options.filter || alwaysTrue;

  this.format = options.format || '%s';
  this.separator = options.separator || '';

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
  var data = this.next();
  var first = true;
  var separator = this.separator;
  var formatted;
  while (!this.paused && this.continuable(data)) {
    this.iterations--;

    if (!this.filter(data)) {
      data = this.next();
      continue;
    }

    formatted = this.formatOutput(data);
    if (!first && isDefined(separator))
      this.emitDataEvent(this.separator);
    this.emitDataEvent(formatted);

    data = this.next();
    first = false;
    this.take--;
  }

  if (data === null || !this.continuable(data))
    this.emitEndEvent();
};

IterStream.prototype.continuable = function continuable(data) {
  return (
    data !== null &&
      this.takeWhile(data) &&
      this.iterations > 0 &&
      this.take > 0
  );
};

IterStream.prototype.next = function next() {
  var value, transformed;
  try {
    value = this.iter[this.method]();
  } catch(err) {
    if (err.name === 'StopIteration' || err.message === 'StopIteration')
      value = null;
    else {
      this.pause();
      this.emit('error', err);
    }
  }
  if (value === null)
    return null;

  transformed = this.transform(value);
  return transformed;
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