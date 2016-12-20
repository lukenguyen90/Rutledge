Math.cathe = function (c, a) { return Math.sqrt(c * c - a * a) }
Math.hypot = function (a, b) { return Math.sqrt(a * a + b * b) }

Number.prototype.precize = function (fp) { return Number(this.toFixed(fp || 5)) }
Number.prototype.between = function (min, max) { return this >= min && this <= max }
Number.prototype.round = function () { return Math.round(this) }

/////////////////////////////////////////////////////////////////////////////////

exports.rangeOverlapped = function (range1, range2) {
  var min = range1[0] > range2[0] ? range1[0] : range2[0]
  var max = range1[1] < range2[1] ? range1[1] : range2[1]
  return min > max ? [max, min] : [min, max]
}

exports.quadrant = function (pnt) {
  var sign = pnt[0] * pnt[1] < 0
  var acut = pnt[0] > 0
  var quad = 1
  if (sign) quad += 1 + (acut ? 2 : 0)
  else if (!acut) quad += 2
  return quad
}

/////////////////////////////////////////////////////////////////////////////////

exports.triangleFormed = function (a, b, c) {
  var sum = a + b + c
  var max = Math.max(a, b, c)
  return max <= (sum - max)
}

exports.pythagos = function (a, b, c) {
  var result = 0
  if (a && b) result = Math.hypot(a, b)
  if (!(a && b) && c) {
    !a && (a = b)
    result = Math.cathe(c, a)
  } else result = c == result
  return result
}

/////////////////////////////////////////////////////////////////////////////////

exports.vector = function (pnt1, pnt2) {
  return [pnt2[0] - pnt1[0], pnt2[1] - pnt1[1]]
}

exports.distance = function (pnt1, pnt2) {
  return Math.hypot.apply(null, exports.vector(pnt1, pnt2))
}

exports.scalarProject = function (vtr, onto) {
  var dot = vtr[0] * onto[0] + vtr[1] * onto[1]
  var onto_mag = Math.hypot.apply(null, onto)
  return Math.abs(dot / onto_mag)
}

exports.vectorAngle = function (vtr) {
  var a = Math.atan2(vtr[1], vtr[0])
  if (exports.quadrant(vtr) > 2) a += 2 * Math.PI
  return a
}

exports.angleBetween = function (vtr1, vtr2) {
  return exports.vectorAngle(vtr2) - exports.vectorAngle(vtr1)
}