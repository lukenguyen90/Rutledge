var stats = global.stats || require('../core/stats')
var prm = {
  lowrx: -90,
  ds: [1, 30, 0.2],
  ns: [1, 3.5, 0.1]
}

// export what is needed
exports.logdistance = logdistance
exports.collected = collected
exports.modelling = modelling
exports.pattern = pattern
exports.spectrum = spectrum

function collected(lowa, higha, d0) {
  if (lowa > higha) throw "Not kidding!"
  var a = stats.range(lowa, higha)
  return a.map(function (_a) {
    return modelling(_a, d0)
  })
}

function modelling(a, d0) {
  var env = {}
  stats.range.apply(null, prm.ns).map(
    function (n) {
      env[n] = pattern(a, d0, n)
    }
  )
  return env
}

function spectrum(a, d0, n) {
  return stats.range.apply(null, prm.ds).map(
    function (d) {
      return {
        x: d,
        y: logdistance.rx(a, d0, n, d)
      }
    }
  ).filter(
    function (p) {
      return p.y >= prm.lowrx
    }
  )
}

function pattern(a, d0, n) {
  return stats.range(prm.lowrx, a).map(
    function (rs) {
      return {
        y: rs,
        x: logdistance(a, d0, n, rs)
      }
    }
  )
}

function logdistance(a, d0, n, rssi) {
  var _df = (a - rssi) / (10 * n)
  return Math.pow(10, _df) * d0
}

logdistance.characterize = function (a, d0, rssi, d) {
  var _lg = 10 * log10(d / d0)
  return Math.abs(a - rssi) / _lg
}

logdistance.rx = function (a, d0, n, d) {
  return a - 10 * n * log10(d / d0)
}

// mini helper

function log10(x) {
  return Math.LOG10E * Math.log(x)
}

if (!module.parent) {
  console.log(stats.range(3), stats.range(-21))
  console.log(stats.range(10, 24))
  console.log(stats.range(10, 10, 10))
  console.log(stats.increase(10, 4, 10))
  console.log(stats.increase(10, 10, 4))

  var A = [-57, -41], d0 = 1
  console.log('one pattern...')
  console.log(pattern(A[0], 1, 2))
  console.log('one spectrum...')
  console.log(spectrum(A[0], 1, 2))
  console.log('one model...')
  console.log(modelling(A[0], 1))
  console.log('creating & modelling...')
  console.log(collected.call(null, A[0], A[1], d0))
}