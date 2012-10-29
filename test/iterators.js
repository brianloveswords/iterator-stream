exports.fib = function fibGenerator() {
  var a = 0;
  var b = 1;
  function fib() {
    var tmpA = a;
    a = b;
    b = tmpA + b;
    if (a === Infinity)
      return null;
    return a;
  }
  fib.next = fib;
  return fib;
};
exports.letter = function letterGenerator() {
  var code = 65;
  var Z = 90;
  function letter() {
    if (code > 90)
      return null;
    var chr = String.fromCharCode(code++);
    return chr;
  }
  letter.next = letter;
  return letter;
};
exports.natural = function naturalNumbers() {
  var num = 0;
  function natural() {
    return num++;
  }
  natural.next = natural;
  return natural;
};