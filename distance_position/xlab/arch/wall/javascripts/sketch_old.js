// environment constants

var _offset = 0 // fit canvas on full display
var _ratio = 40/1 // pixels/meter
var centr = _ratio/2 
var light = [0, 255], spread = 116 // mouse hover
var recta = Math.floor(_ratio/2)
var splus = (_ratio - recta)/2

// drawing variables

var dimension = [0, 0]
var frame = { horizontal:0, vertical:0 }
var p1 = [0, 0], p2 = dimension
var nodes = [], nodmp
var cycle = [], celay, tricl = hsbrand()
var relays = [], tags = {}

// some arbitrary bouncing balls
// var balls = [], count = 26, bubbling = false

/** data io connection section */

var penmind = io()

console.log(nodes, tags)
penmind.on('connect', function ()  
  { console.log('already through !!!') })

penmind.on('onmap', function (data) {
  if (!data.pins && !data.node) return
  
  data.pins.map(function (p,ix,arr) {
    // get real pixels of coordinates 
    var x = p.p[0]*_ratio
    var y = p.p[1]*_ratio
    // triangle vertexes
    arr[ix].a = [x + splus, y + splus]
    arr[ix].b = [x + recta + splus, y + splus]
    arr[ix].c = [x + _ratio/2, y + recta + splus]
    // center point of coordinates
    // arr[ix].cent = centerp.apply({}, p.p)
    arr[ix].cent = centerp(p.p[0], p.p[1])
    // real diameter of rd
    arr[ix].diam = p.rd*_ratio
  }), relays.push(data.pins)

  if (!Array.isArray(tags[data.node.id])) tags[data.node.id] = []
  data.node.points = [], tags[data.node.id].push([])
  var count = tags[data.node.id].length - 1 

  for (var ct in data.node.coord) {
    // center point of coordinates
    var cente = centerp.apply(null, data.node.coord[ct])
    var title = data.node.name + ':' + ct
    var idraw = cente.concat(recta/2, title)
    // data.node.points.push(idraw) // last is real center
    tags[data.node.id][count].push(idraw)
    // console.log(ct, data.node.points, data.node.coord[ct])
  }

  // console.log(data)
  nodes.push(data)
})

// find center pixel of coordinates
function centerp (x, y) {
  // return [x*_ratio + centr, y*_ratio + centr]
  return [insiden(x), insiden(y)]
  function insiden (n) {
    return (+n || 0)*_ratio + centr
  }
}

/** fundamental canvas drawing section */

function preload () {
  // actual pixel values as dimension space
  dimension[0] = windowWidth - _offset
  dimension[1] = windowHeight - _offset
  // lattice grid divisions
  frame.horizontal = dimension[0]/_ratio + 1
  frame.vertical = dimension[1]/_ratio + 1
  // for some information showing
}

function setup () {
  createCanvas.apply({}, dimension)
  // createCanvas(dimension[0], dimension[1])
  textAlign(CENTER) // get text showed in center
  rectMode(RADIUS), ellipseMode(RADIUS) // it says itself
  // colorMode(HSB)
  // noLoop()
  // while (count--) {
  //   var nb = new BounceBall()
  //   balls.push(nb.creation())
  // }
}

function draw () {
  background(6, 72, 67)
  // if (bubbling) balls.map(
  //   function (b) { b.redessine() })
  // mouseover()
  // below is what're really needed to see
  lattice()
  sonaradio()
}

function windowResized () {
  // 2nd step to get it full screen
  // resizeCanvas(windowWidth, windowHeight)
  resizeCanvas.apply({}, dimension)
}

/** draw node data */

// first radar info
function sonaradio () {
  fill(240), textSize(16)
  text(fps(), _ratio*2 - centr, _ratio*2 - centr)
  // nodmp = nodes.slice(-1)[0] || {}
  // pinpoint(nodmp), cirusy(nodmp)
  pinpoint(), cirusy()
  // noLoop()
}

// relay drawing
function pinpoint (data) {
  // if (!data.pins) return
  celay = hsbrand() // get a random color each time
  
  var pinned = relays[relays.length - 1] || []  
  pinned.map(function (dp) {
    brush(0, 0, tricl) // brush for triangles
    triangle.apply({}, dp.a.concat(dp.b, dp.c))
    // outside circle no need color
    // fill(celay, 72), rect.apply(null , dp.cent.concat(dp.diam, dp.diam))
    // brush(223, 2), noFill(), ellipse.apply(null , dp.cent.concat(dp.diam))
    // see found distances
    // fill(255), shapetext(dp.rd.toFixed(2), dp.cent[0], dp.cent[1])
    fill(255), shapetext(dp.id.slice(0,4), dp.cent[0], dp.cent[1])  
  })
}

// calculated nodes
function cirusy (data) {
  // if (!data.node) return
  if (!cycle.length) cycle = palette(4)
  
  // data.node.points.map(cpnt)
  for (var one in tags) {
    var count = tags[one].length
    tags[one][count - 1].map(cpnt)
  }

  function cpnt (cp, ix) {
    if (ix >= cycle.length) cycle.push(hsbrand())
    brush(0, 0), fill(cycle[ix])
    ellipse.apply({}, cp.slice(0, 3))
    shapetext(cp[3], cp[0], cp[1])
  }
}

/** end of node drawing */

// the very first simple-used sketch!  
function mouseover () {
  // and now use for inspecting things
  brush(61, 1), fill(light[+mouseIsPressed])
  ellipse(mouseX, mouseY, spread/2)
}

function fps () {
  return 'fps:' + Math.round(frameRate())
}

// init drawing brush
function brush (color, thick, pour) {
  stroke(color), strokeWeight(thick)
  if (!!pour) fill(pour)
}

// some text above shapes
function shapetext (txt, x, y) {
  // console.log('writing', txt)
  brush(23, 2), textSize(14) 
  text(txt, x, y - centr)
}

// draw a fence & its order 
function fenceray (ix, xyone, xytwo) {
  line.apply({}, xyone.concat(xytwo))
  // line(xyone[0], xyone[1], xytwo[0], xytwo[1])
  text(ix, xyone[0] + 10, xyone[1] + 15)
}

// function of grid dividing
function lattice () { 
  brush(172, 1, 172), textSize(11)

  linadar(0, 'horizontal')
  linadar(1, 'vertical')
  function linadar (ray, dimen) {
    p1[+!ray] = 0, p2[+!ray] = dimension[+!ray]
    for (var ix = 0; ix < frame[dimen]; ix++) {
      p1[ray] = p2[ray] = ix*_ratio
      fenceray(ix, p1, p2)
    }
  }
}

// old function of lattice drawing
function oldlattice () {
  brush(172, 1, 172), textSize(11)
  
  p1[1] = 0, p2[1] = dimension[1]
  for (stix = 0; stix < frame.horizontal; stix++) {
    p1[0] = p2[0] = stix*_ratio
    fenceray(stix, p1, p2)
  }

  p1[0] = 0, p2[0] = dimension[0]
  for (var j = 0; j < frame.vertical; j++) {
    p1[1] = p2[1] = j*_ratio
    fenceray(j, p1, p2)
  }
}

// palette of random colors
function palette (num) {
  return Array.apply(null, {length:+num||0}).map(hsbrand)
}

// random color in HSB, then convert back to RGB
function hsbrand () {
  var r, b, g, s = 0.72, l = 0.5
  var h = Math.round(Math.random()*360)
  var hq = (+h.toFixed(3))/60
  var c = (1 - Math.abs(2*l - 1))*s
  var x = (1 - Math.abs(hq%2 - 1))*c
  var m = l - 0.5*c
  var revert = function (x) {
    return Math.round((x + m)*255).toString(16)    
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

/** from a french guy */
// http://gildasp.fr/exp/P5js-fullscreen/
function BounceBall () {}
BounceBall.prototype = {
	creation : function(){
		this.x = width/2;
		this.y = height/2;
		this.vitx = random(-5, 5);
		this.vity = random(-5, 5);
		this.diam = random(10, 50);
    this.color = hsbrand()
		// this.coulR = random(0, 255);
		// this.coulV = random(0, 255);
		// this.coulB = random(0, 255);
    return this
	},

	redessine : function(){

		// fill(this.coulR, this.coulV, this.coulB);
    fill(this.color)
		ellipse(this.x, this.y, this.diam, this.diam);

		this.x = this.x + this.vitx;
		this.y = this.y + this.vity;
		
		// du coup j'ai modifié les limites...
		// pour qu'une bulle hors champ après le resize puisse revenir
		// dans le sketch...
		if(this.x > width-this.diam/2){
			this.vitx = -1*Math.abs(this.vitx);
		}
		if(this.x < this.diam/2){
			this.vitx = Math.abs(this.vitx);
		}
		if(this.y > height-this.diam/2){
			this.vity = -1*Math.abs(this.vity);
		}
		if(this.y < this.diam/2){
			this.vity = Math.abs(this.vity);
		}
	}
}