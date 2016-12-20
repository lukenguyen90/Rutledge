// drawing variables

var dimension = [0, 0], offscr = [3, 3]
var frame = { horizontal: 0, vertical: 0 }
var p1 = [0, 0], p2 = dimension
var relays = [], tags = { list: [] }, counted = 0
var trigon = { pad: true, grid: true, relay: true }
var types = [
  'trilat', 'circles', 'squares',
  'nearby', 'actual', 'combined'
], cycle = {}, celay = ''

// environment constants

var _offset = 0 // fit canvas on full display
var _ratio = 40 / 1 // pixels/meter
var centr = _ratio / 2
var light = [0, 255], spread = 116 // mouse hover
var recta = Math.floor(_ratio / 2)
var splus = (_ratio - recta) / 2

if (!trigon.pad) splus = - splus / 2

/** data io connection section */

var penmind = io()

console.log(relays, tags)
penmind.on('connect', function ()
{ console.log('already through !!!') })

penmind.on('onmap', function (data) {
  if (!data.pins && !data.node) return

  // necessary data for drawing relays
  data.pins.map(function (p, ix) {
    p.p[0] += offscr[0], p.p[1] += offscr[1]
    // get real pixels of coordinates 
    var x = p.p[0] * _ratio
    var y = p.p[1] * _ratio
    // triangle vertexes
    p.a = [x + splus, y + splus]
    p.b = [x + recta + splus, y + splus]
    p.c = [x + _ratio / 2, y + recta + splus]
    // center point of coordinates
    // p.cent = centerp.apply({}, p.p)
    p.cent = centerp(p.p[0], p.p[1])
    // real diameter of rd
    p.diam = p.rd * _ratio
    // signals to what tag
    p.tag = data.node.id
    // relay shown name as title
    p.title = p.id.slice(0, 4)
  }), relays.push(data.pins) // relays' history

  // check if tag's history doesn't exist  
  if (!Array.isArray(tags[data.node.id]))
    tags[data.node.id] = [];
  tags[data.node.id].push([]) // new history of the tag
  // add to lately shown list
  if (!tags.list.includes(data.node.id))
    tags.list.push(data.node.id);
  var latest = tags[data.node.id].length - 1

  // necessary data for drawing tags  
  for (var ct in data.node.coord) {
    data.node.coord[ct][0] += offscr[0]
    data.node.coord[ct][1] += offscr[1]
    // center point of coordinates
    var cente = centerp.apply(null, data.node.coord[ct])
    var title = data.node.id.slice(0, 4)
    // additional data for drawing
    var idraw = cente.concat(recta / 2, title, ct)
    // keep track of tag's movements
    tags[data.node.id][latest].push(idraw)
  }
})

/** end of io section */
/** fundamental canvas drawing section */

function canvasetto() {
  // actual pixel values as dimension space
  dimension[0] = windowWidth - _offset
  dimension[1] = windowHeight - _offset
  // lattice grid divisions
  frame.horizontal = dimension[0] / _ratio + 1
  frame.vertical = dimension[1] / _ratio + 1
}

function preload() { canvasetto() }

function setup() {
  createCanvas.apply({}, dimension)
  // createCanvas(dimension[0], dimension[1])
  textAlign(CENTER) // get text showed in center
  rectMode(RADIUS), ellipseMode(RADIUS) // it says itself
  types.map(function (ct) { cycle[ct] = hsbrand() })
  celay = hsbrand()
  // colorMode(HSB)
  // noLoop()
}

function draw() {
  background(6, 72, 67, 47)
  // mouseover()
  lattice(), fps(),
    // below is what're really needed to see
    trigon.relay && pinpoint(), nodes()
}

function windowResized() {
  // console.log('window resizing....')
  canvasetto() // 面白い !! 甘い !!
  // 2nd step to get it full screen
  // resizeCanvas(windowWidth, windowHeight)
  resizeCanvas.apply({}, dimension)
}

/** end of fundamentals */
/** data drawings */

// the very first simple-used sketch!  
function mouseover() {
  // and now use for inspecting things
  brush(61, 1), fill(light[+mouseIsPressed])
  ellipse(mouseX, mouseY, spread / 2)
}

function fps() {
  var fps = 'fps:' + Math.round(frameRate())
  brush(255, 1), noFill(), textSize(16)
  text(fps, _ratio * 2 - centr, _ratio * 2 - centr)
}

// function of grid dividing
function lattice() {
  brush(172, 1), fill(172), textSize(11)
  linadar(0, 'horizontal')
  linadar(1, 'vertical')

  function linadar(ray, dimen) {
    p1[+!ray] = 0, p2[+!ray] = dimension[+!ray]
    for (var ix = 0; ix < frame[dimen]; ix++) {
      p1[ray] = p2[ray] = ix * _ratio
      fenceray(ix, p1, p2)
    }
  }
}

// relay drawing
function pinpoint() {
  var pinned = relays[relays.length - 1] || []
  // celay = hsbrand(), 
  pinned.map(info)

  function info(dp) {
    brush(0, 0), fill(celay) // brush for triangles
    triangle.apply({}, dp.a.concat(dp.b, dp.c))
    // new info for inspecting
    fill(255), shapetext(dp.title, dp.cent[0], dp.cent[1])
    if (tags.list.length > 1) return
    noFill(), brush(255, 2),
      ellipse.apply(null, dp.cent.concat(dp.diam))
  }
}

// calculated tags' positions
function nodes() {
  for (var one in tags) {
    if (one == 'list') continue
    counted = tags[one].length
    tags[one][counted - 1].map(tagonmap)
  }

  function tagonmap(cp, ix) {
    if (ix >= cycle.length) cycle.push(hsbrand())
    brush(0, 0), fill(cycle[cp[4]])
    ellipse.apply({}, cp.slice(0, 3))
    shapetext(cp[3] + ':' + cp[4], cp[0], cp[1])
  }
}

/** end of drawing */
/** some helpers for drawing */

// find center pixel of coordinates
function centerp(x, y) {
  return [insiden(x), insiden(y)]
}

function insiden(n) {
  return (+n || 0) * _ratio + centr
}

// init drawing brush
function brush(color, thick) {
  stroke(color), strokeWeight(thick)
}

// some text above shapes
function shapetext(txt, x, y) {
  brush(23, 2), textSize(14)
  text(txt, x, y + centr)
}

// palette of random colors
function palette(num) {
  return Array.apply(null, { length: +num || 0 }).map(hsbrand)
}

// draw a fence & its order 
function fenceray(ix, xyone, xytwo) {
  text(ix, xyone[0] + 10, xyone[1] + 15),
    trigon.grid && line.apply({}, xyone.concat(xytwo))
  // line(xyone[0], xyone[1], xytwo[0], xytwo[1])
}

// random color in HSB, then convert back to RGB
function hsbrand() {
  var r, b, g, s = 0.72, l = 0.5
  var h = Math.round(Math.random() * 360)
  var hq = (+h.toFixed(3)) / 60
  var c = (1 - Math.abs(2 * l - 1)) * s
  var x = (1 - Math.abs(hq % 2 - 1)) * c
  var m = l - 0.5 * c
  var revert = function (x) {
    return Math.round((x + m) * 255).toString(16)
  }

  switch (Math.floor(hq)) {
    case 6:
    case 0: r = c, g = x, b = 0; break;
    case 1: r = x, g = c, b = 0; break;
    case 2: r = 0, g = c, b = x; break;
    case 3: r = 0, g = x, b = c; break;
    case 4: r = x, g = 0, b = c; break;
    case 5: r = c, g = 0, b = x; break;
    default: r = 0, g = 0, b = 0; break;
  }

  return '#' + revert(r) + revert(g) + revert(b)
}

/** end of helpers */