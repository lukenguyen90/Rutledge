// just take whole script downed 1 line
require('../mechina')

var simconf = load.page('four').simulation
var amqconn = load.link('broker')().connect()
var datasim = amqconn.sendto(page0.channel.calibre)
// rangeom values from necessary ranges
var dbended = range.bind.apply(range, [null, simconf.dnoise])
var step = range.bind(null, -simconf.onestep, simconf.onestep)
var ground = process.env.GRID == 'on'
// runtime data initializing
simconf.tagsinplay.map(
  function (tag, i, arr) { 
    arr[i].coord = aroundcenter() 
    arr[i].steps = +arr[i].steps
  })
console.log('initialised!', simconf.tagsinplay)

var start = Date.now()
var counter = simconf.tagsinplay.length
var interval = setInterval(function () {
    backloop(simconf.tagsinplay, runtime)
    if (!counter) finish()
  }, simconf.duration*1000)

function runtime (tag) {
  // proc: tag's step counting
  // console.log(tag.ended, tag.steps)
  if (tag.ended || !tag.steps--) {
    console.log('tag', tag.id, 'ended!')
    if (tag.ended = true, !counter--) return
  }

  // proc: distances calculation
  eachprop(simconf.deployments, function (relay, coord) {
    // first props of sending data 
    var data = structure(tag.id, relay)
    // distance calculation
    data.distance = farness(tag.coord, coord)
    data.distance += dbended() // add noise
    data.distance = fiz(data.distance, 2) // fix to 2 decimal numbers
    // for showing on sonar map 
    data.coord = coord, data.realpos = tag.coord
    // get to inspect the data
    console.log(data), datasim.message(data)
  })

  // proc: tag makes new move
  if (!simconf.area.inside) {
    // simple stepping
    tag.coord[0] += step(), tag.coord[1] += step()
  } else {
    // check if it's goin' out of area
    tag.coord.map(function (mc,i,xy) {
      var nmc = mc + step()
      var lim = simconf.area[i? 'height': 'width']
      ;(nmc >= 0) && (nmc <= lim) && (xy[i] = nmc)
    })
  }
  console.log('new move!', tag.id, tag.coord)
}

process.on('exit', function () {
  console.log('exiting', arguments), finish()
})

function finish () {
  clearInterval(interval), amqconn.end()
}

function structure (tagid, relayid) {
  return {
    // longid: tagid, longsid: relayid, // old id keys 
    target: tagid, scanner: relayid // new ones
  }
}

function farness (n1, n2) {
  return Math.sqrt(dsqr(0) + dsqr(1))
  function dsqr (i) {
    return Math.pow((n2[i] - n1[i]) || 0, 2)
  }
}

function aroundcenter () {
  return [nearmid('width'), nearmid('height')]
}

function nearmid (side) {
  return around(+simconf.area[side]/2, +simconf.awaymid)
}

function around (x, bound) {
  if (!bound) bound = 0
  return range(x - bound, x + bound)
}

function range (grn, sky) {
  if (!sky && !!grn) sky = grn, grn = NaN
  grn = +grn || 0, sky = +sky || 0
  var val = Math.random()*(sky - grn) + grn
  return ground ? Math.round(val): val
}