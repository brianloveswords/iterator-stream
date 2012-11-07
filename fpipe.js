const Stream = require('stream');
const streamProto = Stream.prototype;

function pipeline(fn) {
  var stream;
  if (fn.pipe) // assume it's a stream
    fn.fpipe = stream.fpipe;
  stream = Object.create(pipelineProto);
  stream.fn = fn;
  stream.readable = true;
  stream.writable = true;
  return stream;
};

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
  this.emit('end');
};

pipelineProto.send = function send() {
  this.emit.bind(this, 'data').apply(null, arguments);
};

pipelineProto.log =
  pipeline.log = function log(description) {
    return function () {
      console.log('\n---', description, '::', arguments, '---');
      this.send.apply(this, arguments);
    }
  };

pipelineProto.disperse =
  pipeline.disperse = function disperse (x) {
    x.forEach(this.send.bind(this));
  };

pipelineProto.filter =
  pipeline.filter = function filter(conditionFn) {
    return function () {
      var bool = conditionFn.apply(conditionFn, arguments);
      if (bool)
        this.send.apply(this, arguments);
    }
  }

pipelineProto.format =
  pipeline.format = function format(fmt) {
    return function(x) {
      return require('util').format(fmt, x);
    }
  }

pipelineProto.elem =
  pipeline.elem = function elem(x) {
    return function (obj) { return obj[x] }
  }



pipeline.logger = console.log;
module.exports = pipeline;
