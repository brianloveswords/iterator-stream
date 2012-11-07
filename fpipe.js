const Stream = require('stream');
const streamProto = Stream.prototype;

const pipelineProto = Object.create(streamProto);
pipelineProto.fpipe = function fpipe(endpoint, type) {
  if (!endpoint.pipe && typeof endpoint === 'function')
    endpoint = pipeline(endpoint);
  return streamProto.pipe.call(this, endpoint);
};

pipelineProto.begin = function begin() {
  this.fn(function (err) {
    var args = [].slice.call(arguments, 1);
    if (err)
      return this.emit('error', err);
    this.emit.bind(this, 'data').apply(null, args);
    this.emit('end');
  }.bind(this));
};

pipelineProto.write = function write() {
  var value = this.fn.apply(this, arguments);
  if (typeof value !== 'undefined')
    this.emit('data', value);
};

pipelineProto.end = function end() {
  if (arguments.length)
    return this.write.apply(this, arguments);
};

pipelineProto.send = function send() {
  this.emit.bind(this, 'data').apply(null, arguments);
};

const pipeline = function pipeline(fn) {
  var stream;
  if (fn.pipe) // assume it's a stream
    fn.fpipe = stream.fpipe;
  stream = Object.create(pipelineProto);
  stream.fn = fn;
  stream.readable = true;
  stream.writable = true;
  return stream;
};

pipeline.disperse = function (x) {
  x.forEach(this.send.bind(this));
};

pipeline.log = function (description) {
  return function (x) {
    console.log('\n---', description, '::', x, '---');
    return x;
  }
};
pipeline.logger = console.log;
module.exports = pipeline;
