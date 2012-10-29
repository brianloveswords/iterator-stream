var util = require('util');
var Stream = require('stream');
function StreamString() {
  Stream.call(this);
  this.writable = true;
  this.value = '';
  this.events = [];
};
util.inherits(StreamString, Stream);
StreamString.prototype.write = function write(str) {
  this.value += str;
  this.events.push({ data: str, size: str.length })
};
StreamString.prototype.end = function end(str) {
  if (str)
    this.write(str);
  this.emit('end');
};
module.exports = function () { return new StreamString };