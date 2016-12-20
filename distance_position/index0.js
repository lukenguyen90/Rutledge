require('./mechina')('link.broker')

var area = [6, 6] // width x height in metres
var step = rand.bind(null, -1, 1)
var link = broker(process.env.NODE_ENV).connect()
var sympos = link.emit(page0.channel.posimap)

var argex = require('minimist')(process.argv.slice(2))
var count = Number(argex.num) || 5
var trans = !argex.wander ? 'move' : 'wander'

var tagboards = []
var ongrid = streql('on', process.env.GRID)

while (tagboards.push(new mobile()), --count);
console.log(tagboards)

var symloop = setInterval(
  function () {
    tagboards.map(transition)
  }, 2000)

function transition(tag) {
  tag[trans]()
  console.log(tag)
  sympos.letter(tag)
}

process.on('exit', function () {
  console.log('exiting', arguments)
  clearInterval(symloop), link.end()
})

function mobile(devID) {
  if (!devID) devID = mechid()

  this.name = 'tagbrd_' + devID.slice(0, 4)
  this.mobile = devID
  this.position = area.map(
    function (upper) {
      var cent = upper / 2
      return rand(cent - 3, cent + 3)
    }
  )
}

mobile.prototype.wander = function () {
  this.position[0] += step()
  this.position[1] += step()
  return this
}

mobile.prototype.move = function () {
  this.position.map(function (mc, i, xy) {
    var nmc = xy[i] + step()
    xy[i] = (nmc < 0) || (nmc >= area[i]) ? xy[i] : nmc
  })
  return this
}

function rand(grd, sky) {
  if (!sky && !!grd) sky = grd, grd = NaN
  grd = +grd || 0, sky = +sky || 1
  var val = Math.random() * (sky - grd) + grd
  return ongrid ? Math.round(val) : val
}

function mechid() {
  return ('xxxxxxxxxxxxxxxxxx').replace(/x/g, hexrand)
  function hexrand() {
    return Math.round(Math.random() * 16).toString(16)
  }
}