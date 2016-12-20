exports.max = function (arr) {
  return Math.max.apply({}, arr)
}

exports.min = function (arr) {
  return Math.min.apply({}, arr)
}

exports.mean = function (arr) {
  var _s = arr.reduce(plus)
  return _s / arr.length
  function plus(a, b) { return a + b }
}

exports.difference = function (arr) {
  var _m = exports.mean(arr)
  return arr.map(minus.bind({}, _m))
  function minus(a, b) { return a - b }
}

exports.variance = function (arr) {
  var _t = exports.difference(arr)
  return exports.mean(_t.map(sqr))
  function sqr(x) { return x * x }
}

exports.std_deviation = function (arr) {
  return Math.sqrt(exports.variance(arr))
}

exports.dash = function (len, val) {
  var value = function () { return val }
  if (typeof val == 'function') value = val
  return Array.apply(null, { length: +len }).map(value)
}

exports.range = function (start, end, inc) {
  var arr = []
  start = Number(start) || 0
  end = Number(end) || 0
  inc = Number(inc) || 1
  if (start > 0 && start > end)
    start = [end, end = start][0];
  while (start <= end &&
    (arr.push(start), start += inc));
  return arr
}

exports.increase = function (start, inc, steps) {
  var arr = []
  start = Number(start) || 0
  steps = Number(steps) || 1
  inc = Number(inc) || 1
  while (arr.push(start),
    start += inc, steps--);
  // do { arr.push(start), 
  //   start += inc } while (steps--)
  return arr.length > 1 ? arr : arr[0]
}