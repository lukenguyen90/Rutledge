// module.exports = {
//   gridpos: gridpos, 
//   CircusFencing: CircusFencing,
//   SquareBordering: SquareBordering,
//   Trilaterate: Trilaterate,
//   NearIntersect: NearIntersect
// }

var Calculus = require('./calculus')

/////////////////////////////////////////////////////////////////////////////////

exports.gridpos = function gridpos(coord) {
  var pos = Array.isArray(coord) ? coord : [NaN, NaN]
  // return pos.forEach(function(c) {return (c < 0 ? 0:c).round()})
  // console.log(coord)
  return [pos[0].round(), pos[1].round()]
}

function shuffle(arry) {
  if (!Array.isArray(arry)) return []

  var cur = arry.length, tmp, idx

  while (!!cur) {
    idx = Math.floor(Math.random() * cur--)
    tmp = arry[cur], arry[cur] = arry[idx], arry[idx] = tmp
  }

  return arry
}

function square(x) { return x * x }

/////////////////////////////////////////////////////////////////////////////////

exports.NearIntersect = function NearIntersect(pntA, pntB, pntC) {
  var dist = Calculus.distance.bind(null, pntC.p)
  // var phis = intersection(pntA.p[0], pntA.p[1], pntA.rd, pntB.p[0], pntB.p[1], pntB.rd)
  var phis = intersection.apply(null, pntA.p.concat(pntA.rd, pntB.p, pntB.rd))
  // var _dd1 = Calculus.distance(pntC.p, phis[0])
  // var _dd2 = Calculus.distance(pntC.p, phis[1])
  // var _dd1 = dist(phis[0]), _dd2 = dist(phis[1])
  var _dd1 = Math.abs(pntC.rd - dist(phis[0]))
  var _dd2 = Math.abs(pntC.rd - dist(phis[1]))
  // var near = Math.abs(pntC.rd - dd1) < Math.abs(pntC.rd - dd2)
  // return near? phis[0]: phis[1]
  return phis[_dd1 < _dd2 ? 0 : 1]
}

function intersection(x0, y0, r0, x1, y1, r1) {
  var a, dx, dy, d, h, rx, ry;
  var x2, y2, rate = 3 / 4;

  /* dx and dy are the vertical and horizontal distances between
    * the circle centers.
    */
  dx = x1 - x0;
  dy = y1 - y0;

  /* Determine the straight-line distance between the centers. */
  d = Math.sqrt((dy * dy) + (dx * dx));

  /* Check for solvability. */
  if (d > (r0 + r1)) {
    /* no solution. circles do not intersect. */
    if (r1 > r0) {
      r1 = d - rate * r0;
    } else {
      r0 = d - rate * r1;
    }
  }
  if (d < Math.abs(r0 - r1)) {
    /* no solution. one circle is contained in the other */
    if (r1 > r0) {
      r1 = d - rate * r0;
    } else {
      r0 = d - rate * r1;
    }
  }

  /* 'point 2' is the point where the line through the circle
    * intersection points crosses the line between the circle
    * centers.  
    */

  /* Determine the distance from point 0 to point 2. */
  a = ((r0 * r0) - (r1 * r1) + (d * d)) / (2.0 * d);

  /* Determine the coordinates of point 2. */
  x2 = x0 + (dx * a / d);
  y2 = y0 + (dy * a / d);

  /* Determine the distance from point 2 to either of the
    * intersection points.
    */
  h = Math.sqrt((r0 * r0) - (a * a));

  /* Now determine the offsets of the intersection points from
    * point 2.
    */
  rx = -dy * (h / d);
  ry = dx * (h / d);

  /* Determine the absolute intersection points. */
  var xi = x2 + rx;
  var xi_prime = x2 - rx;
  var yi = y2 + ry;
  var yi_prime = y2 - ry;

  return [[xi, yi], [xi_prime, yi_prime]];
}

/////////////////////////////////////////////////////////////////////////////////

exports.CircusFencing = function CircusFencing(circuses) {
  var orders = circuses
  if (!orders.length) return null

  var tries = 10, possiblities, pntX

  while (!(possiblities && pntX) && (tries--)) {
    orders = shuffle(orders)
    // order of circles
    var pntA = orders[0]
    var pntB = orders[1]
    var pntC = orders[2]
    // find possible intersections of A & B
    // possiblities = CircusPossibilities(pntA, pntB)
    possiblities = CircusIntersect(pntA, pntB)
    // possiblities = intersection.apply(null, pntA.p.concat(pntA.rd, pntB.p, pntB.rd))
    if (!possiblities) continue
    // which is the closest to C?
    pntX = Closest(possiblities, pntC)
  }

  return pntX
}

// yup, they're all 'bout possiblities
function CircusPossibilities(pntA, pntB) {
  // always let bigger circle comes first 
  if (pntB.rd > pntA.rd) pntA = [pntB, pntB = pntA][0]
  // basic geometry info of points A & B 
  var v_ab = Calculus.vector(pntB.p, pntA.p)
  var d_ab = Math.hypot.apply(null, v_ab)
  // optimising radiuses happens here
  // because no such a triangle exists
  if (!Calculus.triangleFormed(pntA.rd, pntB.rd, d_ab)) {
    // when they don't really cut each other
    if (d_ab > (pntA.rd + pntB.rd)) {
      orhale()
    }
    // when one is completely inside the other
    if (d_ab < (pntA.rd - pntB.rd)) {
      orhale()
    }
  }

  // get these numbers squared in advance
  var sqrd = [pntA.rd, pntB.rd, d_ab].map(square)
  // distance from A to a point projected on line of 2 centers
  var frma = (sqrd[0] - sqrd[1] + sqrd[2]) / (2.0 * d_ab)
  // projected point's coordinates
  var scal = pntA.p.map(
    function (v, ix) { return v + v_ab[ix] * frma / d_ab })
  // height from this projected point to actual intersections
  var heig = Math.cathe(pntA.rd, frma)
  // perpendicular vector of vector AB
  var perp = [-v_ab[1], v_ab[0]].map(
    function (v, ix) { return v * heig / d_ab })

  return [ // coordinates of possible intersections
    [scal[0] + perp[0], scal[1] + perp[1]],
    [scal[0] - perp[0], scal[1] - perp[1]]
  ]

  // a little rd scaler
  function orhale() {
    return pntA.rd = d_ab - pntB.rd * 2 / 3
  }
}

function Closest(phis, pntC) {
  var dist = Calculus.distance.bind(null, pntC.p)
  // loop through and calculate distance to C
  var dsc2x = phis.map( // and see if that dx is near rd of C 
    function (xp) { return Math.abs(pntC.rd - dist(xp)) })
  // wonder if both can meet the condition; nah :))
  var d_min = Math.min.apply(null, dsc2x)
  return phis[dsc2x.indexOf(d_min)]
}

// find coordinates of exact intersections
function CircusIntersect(pntA, pntB) {
  var ab_mag = Calculus.distance(pntA.p, pntB.p)
  var passed = Calculus.triangleFormed(ab_mag, pntA.rd, pntB.rd)

  if (!passed) return

  var p = (ab_mag + pntA.rd + pntB.rd) / 2
  var area = p * (p - ab_mag) * (p - pntA.rd) * (p - pntB.rd)
  var ht = 2 * Math.sqrt(area) / ab_mag
  var ab_vtr = [pntB.p[0] - pntA.p[0], pntB.p[1] - pntA.p[1]]

  var ratioc1 = Math.sqrt(pntA.rd * pntA.rd - ht * ht) / ab_mag
  var prjd_xp = [ab_vtr[0] * ratioc1 + pntA.p[0], ab_vtr[1] * ratioc1 + pntA.p[1]]
  var ratioht = ht / ab_mag, perp = [-ab_vtr[1] * ratioht, ab_vtr[0] * ratioht]

  return [
    [prjd_xp[0] + perp[0], prjd_xp[1] + perp[1]],
    [prjd_xp[0] - perp[0], prjd_xp[1] - perp[1]]
  ]
}

/////////////////////////////////////////////////////////////////////////////////

exports.Trilaterate = function Trilaterate(pntA, pntB, pntC) {
  var ab_vector = [pntB.p[0] - pntA.p[0], pntB.p[1] - pntA.p[1]]
  var ac_vector = [pntC.p[0] - pntA.p[0], pntC.p[1] - pntA.p[1]]
  var theta = Calculus.angleBetween(ab_vector, ac_vector)
  if (Math.abs(theta) > (Math.PI / 2)) pntA = [pntB, pntB = pntA][0]

  var r2 = [pntA.rd, pntB.rd, pntC.rd].map(square)
  var origin = pntA.p, trilad = [0, 0]
  // var d_edge = [pntB.p[0] - origin[0], pntB.p[1] - origin[1]]
  var d_edge = Calculus.vector(origin, pntB.p)
  // var ij_vector = [pntC.p[0] - origin[0], pntC.p[1] - origin[1]]
  var ij_vector = Calculus.vector(origin, pntC.p)

  var d = Math.hypot.apply(null, d_edge)
  var j = Calculus.scalarProject(ij_vector, [-d_edge[1], d_edge[0]])
  var i = Math.cathe(Math.hypot.apply(null, ij_vector), j)

  trilad[0] = (r2[0] - r2[1] + d * d) / (2 * d)
  trilad[1] = (r2[0] - r2[2] + i * i + j * j) / (2 * j) - (i / j) * trilad[0]

  theta = Calculus.angleBetween(d_edge, ij_vector)
  if (theta < 0) trilad[1] = -trilad[1]

  theta = Calculus.vectorAngle(d_edge)

  return [
    trilad[0] * Math.cos(theta) - trilad[1] * Math.sin(theta) + origin[0],
    trilad[1] * Math.cos(theta) + trilad[0] * Math.sin(theta) + origin[1]
  ]
}

/////////////////////////////////////////////////////////////////////////////////

exports.SquareBordering = function SquareBordering() {
  var pnts = arguments
  if (!pnts.length) return undefined

  var x_ranges = [], y_ranges = []

  for (var idx = pnts.length; idx--;) {
    x_ranges.push(border(pnts[idx], 0))
    y_ranges.push(border(pnts[idx], 1))
  }

  var range = { x: x_ranges[0], y: y_ranges[0] }
  for (idx = pnts.length; idx--;) {
    range.x = Calculus.rangeOverlapped(range.x, x_ranges[idx])
    range.y = Calculus.rangeOverlapped(range.y, y_ranges[idx])
  }

  return [
    (range.x[0] + range.x[1]) / 2,
    (range.y[0] + range.y[1]) / 2
  ]

  function border (pp, axis) {
    return [pp.p[axis] - pp.rd, pp.p[axis] + pp.rd]
  }
}