var util = require('util');
var Stream = require('stream');
function StreamString() {
  Stream.call(this);
  this.writable = true;
  this.value = '';
};
util.inherits(StreamString, Stream);
StreamString.prototype.write = function write(str) {
  this.value += str.toString();
};
StreamString.prototype.end = function end(str) {
  this.write(str || '');
};
module.exports = function () { return new StreamString };