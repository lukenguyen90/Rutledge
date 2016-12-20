if (!module.parent) return
else module.exports = modelbox

var modeller = load.core('model')
var logdst = modeller.logdistance
var avg = load.core('stats').mean

if (!!process.env.EXACTLY)
  rand = function () { return 0 }

function rand() {
  return fiz(Math.random() * 0.03, 1)
}

function modelbox(opts) {
  if (!itis.Object(opts)) opts = {}
  this.count = opts.count || 25
  this.slice = opts.slice || 10
  this.devic = '' // a device as data source
  // first base of a radio model for start `A`
  var d0 = opts.based || opts.d0 || 1
  this.start = { d: d0 + rand(), box: [] }
  // second base for environment charater value
  var dx = opts.away || opts.dx || 4
  this.envrm = { d: dx + rand(), box: [] }
  this.mdtyp = 'spectrum'
}

modelbox.prototype.ready = function () {
  return !!this.initx & !!this.enval
}

modelbox.prototype.base = function (rssi, source) {
  if (!!this.initx || source != this.devic) return

  this.start.box.push(rssi) // this box might work...
  if (!this.initx) print('pick:', rssi,
    '(' + this.start.box.length + ') ')

  if (this.count == this.start.box.length) {
    this.initx = fiz(avg(this.start.box), 2)
    print('fin. @', this.initx, '')
    this.start.upper = Math.max.apply({}, this.start.box)
    this.start.lower = Math.min.apply({}, this.start.box)
  }
}

modelbox.prototype.characterize = function (rssi, source) {
  if (!this.initx || source != this.devic) return
  if (this.basebound(rssi)) return

  // environment parameter at the time
  var prms = [this.initx, this.start.d, rssi, this.envrm.d]
  // collect rssi used for calculating character value
  this.envrm.box.push(rssi)
  this.enval = logdst.characterize.apply({}, prms)
  this.enval = fiz(this.enval, 1)

  print('env:', prms.join(' '), '')
  print('n=', this.enval, '')

  return {
    a: this.initx, n: this.enval, d0: this.start.d,
    log: modeller[this.mdtyp](this.initx, this.start.d, this.enval)
  }
}

modelbox.prototype.distance = function (rssi) {
  if (!this.initx || !this.enval) return NaN
  if (this.basebound(rssi)) {
    print('inbase')
    return this.start.d
  }

  // all required values for calculating
  var prms = [this.initx, this.start.d, this.enval, rssi]
  var _cal = logdst.apply(null, prms) // get the result

  print('dcal:', prms.join(' '), '')
  return _cal
}

modelbox.prototype.basebound = function (rssi) {
  return !this.initx ? true :
    this.start.lower <= rssi &&
    rssi <= this.start.upper
}