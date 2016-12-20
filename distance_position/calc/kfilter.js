var kalman = {}, mem = {}
var filvalue = 'rssi', uctrl = 0

function main (data, xenv) {
  // console.log(data)
  
  var _v = data[filvalue]
  if (!_v) return mem
  
  var _k = data.scanner + ':' + data.target
  if (!kalman[_k]) kalman[_k] = new filter(xenv)
  
  mem.filtered = kalman[_k].value(_v, uctrl)

  // finish calculating
  return mem
}

module.exports = main

main.filter = filter
main.init = function (opts) {
  filvalue = opts.filvalue || opts.filter || 'rssi'
  console.log('Filtering values of', filvalue)
  return this
}

function filter (rates) {
  this.R = rates.R || rates.r || rates.measure // measure noise (faulty measurement)
  this.Q = rates.Q || rates.q || rates.process // process noise 
  if (!this.R || !this.Q) throw "Not enough noises!"

  this.A = rates.A || rates.a || 1
  this.B = rates.B || rates.b || 0
  this.H = rates.H || rates.h || 1

  this.P = rates.P || 0 
  this.x = rates.x || 0,
  this.K = rates.K || NaN // kalman gain
  this._x = rates._x || NaN
  this._P = rates._P || NaN
}

filter.prototype.value = function (z) {
  var _u = !arguments[1]? 0: arguments[1]

  if (!isNaN(z = +z)) {
    if (this.x == 0) {
      // this.x = z
      this.x = z/this.H
      this.P = this.Q/Math.pow(this.H, 2)
    }
    else {
      // prediction step
      this._x = this.A*this.x + this.B*_u
      this._P = this.A*this.P*this.A + this.Q 

      this.K = this._P*this.H/(this.H*this._P*this.H + this.R) 
      // update (correction) step
      this.x = this._x + this.K*(z - this.H*this._x)
      this.P = this._P*(1 - this.K*this.H)
    }

    this.x = fiz(this.x, 2)
  }

  return this.x
}