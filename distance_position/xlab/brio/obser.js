if (!module.parent) return;
else module.exports = observer

var ststc = load.core('stats')
var page3 = load.page('three')
var clios = 'http://' + page3.host + ':' + page3.port

observer.stats = stats, observer.mux = obsmux
observer.steam = require('socket.io-client')(clios)

function observer(obs_title, keys) {
  var xtrc = {}
  var _obs = page3.observation
  var _x = wordsplit(keys)

  _obs.map(function (oe, ix) {
    var _k = oe.key
    if (oe.alias) {
      oe.alias.forEach(function (als) {
        if (_x.indexOf(als) > -1) _k = als
      })
    }
    if (_x.indexOf(_k) < 0) return

    var _t = [oe.title, obs_title] // title format
    if (oe.unit) _t.splice(1, 0, '(' + oe.unit + ')')
    xtrc[_k] = new stats(_k, _t.join(' '), _k)
  })

  console.log('Observing', Object.keys(xtrc).join(', '))

  return xtrc
}

function obsmux(obs_title, keys) {
  var _osk = wordsplit(keys)
  var _obs = page3.concurrent
  var xtrc = {}

  _obs.map(function (skob) {
    var _kob = skob.key.split(' ').filter(
      function (k) { return _osk.indexOf(k) > -1 }
    ); if (!_kob.length) return

    var _ttl = [skob.title, obs_title].join(' ')
    var _mon = new stats(_kob.join(''), _ttl)

    _kob.map(function (k) {
      _mon.addserie(k); return k
    }).map(function (k) { xtrc[k] = _mon })
  })

  return xtrc
}

function sampledata(data) {
  observer.steam.emit(page3.serie, data)
}

function livedata(value) {
  console.log('streaming...', value)
  observer.steam.emit(page3.live, value)
}

function init(stats) {
  var _chart = copy(stats, {})
  delete _chart.box

  emitting() // always emit first when unit is up
  observer.steam.on(page3.creation, emitting)

  function emitting(mexag) {
    // handle message from upsteam
    if (!!mexag) {
      console.log('from bridge box:', mexag)
    }

    // real emitting process
    console.log('initialising...', _chart)
    sampledata(_chart)
  }
}

function xpline(obj) {
  return itis.Empty(obj) ? {} :
    spline(obj.name || obj, obj.data)
}

function spline(name, data) {
  return {
    name: name.toString(),
    data: Array.isArray(data) ? data : []
  }
}

function stream(id, value, shift, idx) {
  return {
    id: String(id), shift: !!shift,
    idx: typeof idx == 'undefined' ? -1 : (+idx || 0),
    values: Array.isArray(value) ? value.map(Number) : [+value]
  }
}

// main function of updating & showing

function stats(id, title) {
  this.id = String(id)
  this.title = String(title)
  this.series = [] // one 4 initialising chart

  // get rid of first 2 arguments
  delete arguments[0], delete arguments[1]
  // make this more dynamic 
  if (!itis.Empty(arguments[2]) && // make sure it's not empty
    itis.Object(arguments[2][0])) { // as 3rd arg is an array of series
    this.series = arguments[2]
  } else { // add tailed arguments as serie
    arguments.each(function (_, argval) {
      // console.log(arguments[_])
      // if (_ == '0' || _ == '1') continue
      var serie = xpline(argval)
      this.series.push(serie)
    })
  }

  init.call({}, this) // maybe this is more proper
}

stats.prototype.update = function (value, serie, show) {
  if (!itis.Number(value)) return
  if (!this.hasserie(serie)) this.addserie(serie, true, show)

  var _sid = this.id, _b

  this.series.map(function (sr, ix) {
    if (sr.name != serie) return
    sr.data.push(value)
    _b = sr.data.length > page3.shift
    if (!!show) livedata(stream(_sid, value, _b, ix))
  })
}

stats.prototype.concurrent = function (value, serie, show) {
  if (!itis.Number(value)) return
  if (!this.hasserie(serie)) this.addserie(serie, true, show)

  var _box = [], _b, _v

  this.series.map(function (sr, ix) {
    _v = sr.name != serie ? sr.data.last() : value
    _box.push(_v), sr.data.push(_v)
  })

  _b = this.series[0].data.length > page3.shift
  if (!!show) livedata(stream(this.id, _box, _b))
}

stats.prototype.addserie = function (serie, init, show) {
  var _s = xpline(serie)
  if (this.hasserie(_s.name)) return

  if (init) { // when need to keep up what have collected
    var lns = this.series.map(
      function (sr) { return sr.data.length })
    _s.data = ststc.dash(Math.max.apply(null, lns))
  }
  // welcome new serie
  this.series.push(_s)
  // this.box.push(_s.data)
  // if its chart is already on
  if (!!show) { _s.id = this.id; sampledata(_s) }
}

stats.prototype.show = function () {
  sampledata.call({}, this)
}

stats.prototype.hasserie = function (serie) {
  var _sr = String(serie), has = 0
  this.series.map(function (sr) {
    if (sr.name == _sr) has += 1
  })
  return has > 0
}

stats.prototype.allseries = function () {
  return this.series.map(
    function (sr) { return sr.name })
}