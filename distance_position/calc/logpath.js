if (!module.parent) return
else module.exports = main

var avg = load.core('stats').mean

function main() { }

main.logpath = logpath
main.init = function () { }

function logpath(opts) {
  if (!itis.Object(opts)) opts = {}

  this.count = opts.count || 25
  this.slice = Math.abs(+opts.slice || 10)
  // independent variables
  this.watch = clock().stopwatch()
  this.terra = { source: null, d: 0 }
  this.polen = { source: null, d: 0 }
  this.boxes = {}
  this.envbx = []
}

logpath.prototype.calibrate = function (rssi, source) {
  if (!this.boxes[source]) this.boxes[source] = []
  if (source != this.terra.source) this.boxes[source].push(rssi) // keep it inside
  // some source would be its pole of characterization
  if (source == this.polen.source) this.envmodel(rssi, source)
  if (this.start) return // その開始時刻!!
  // stmt-s after above only run before `this.start` is init

  if (source == this.terra.source && this.count--) {
    this.watch.click() // counting calibartion time
    this.boxes[this.terra.source].push(rssi)
    print('pick:', rssi, '(' + this.boxes[this.terra.source].length + ') ')
  }

  if (this.count == 0) { // time has come!
    this.start = this.watch.stoptrack()
    // this.watch.stopwatch()
    this.initx = avg(this.boxes[this.terra.source])
    this.initx = fiz(this.initx, 2)

    if (source == this.polen.source && 
      this.boxes[source].length > 0) 
      {
        // just some stamp as mark of the step 
        print('env.characterizing... ')
        for (var i = this.boxes[source].length; i--;)
          this.envmodel(this.boxes[source][i], source);
      }

    print( // hope it can go well!
      'fin. @', this.initx,
      '(' + this.start.runtime + ') '
    )
  }
}

logpath.prototype.envmodel = function (rssi, source) {
  if (!this.initx ||
    source != this.polen.source) return

  // environment parameter at the time
  var _env = [this.initx, this.terra.d, rssi, this.polen.d]
  // collect calculated character value
  this.envbx.push(envcharacter.apply({}, _env))
  // check if this's the time for modelling env
  if (this.envbx.length % this.slice) return
  // after 'efficient enough', go w/ real calculation
  this.envch = avg(this.envbx.slice(-this.slice))
  this.envch = fiz(this.envch, 1)
  if (this.envch <= 1) this.envch = 1.89
  print('env:', this.envch, '')
}

logpath.prototype.distance = function (rssi) {
  if (!this.initx || !this.envch) return NaN
  // this.initx = fiz(this.initx, 3)
  // if (this.envch <= 1) this.envch = 1.89
  
  print('debug:',this.initx, this.terra.d, this.envch, rssi,"")
  var _cal = logdistance(this.initx, this.terra.d, this.envch, rssi)
  // inspecting another calulation function; but needed?

  return fiz(_cal, 1)
}

// radio model formulas

function logdistance(a, d0, n, rssi) {
  var _df = (a - rssi) / (10 * n)
  return Math.pow(10, _df) * d0
}

function rocky(a, d0, n, rssi) {
  var _pw = Math.pow(10, (a - rssi) / 10)
  return Math.pow(_pw, 1 / n) * d0 // the most rocky ever
}

function envcharacter(a, d0, rssi, d) {
  var _lg = 10 * log10(d / d0)
  return Math.abs(a - rssi) / _lg
}

function log10(x) {
  return Math.LOG10E * Math.log(x)
}