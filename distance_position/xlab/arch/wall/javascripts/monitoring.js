var chalk = {}, names = {}
console.log(names)

chalk.statistics = function (message) {
  var stat_id = message.id
  
  var chopts = { title: message.title }
  var series = message.sample || message.series

  var nserie = {
    name: message.name,
    data: message.data
  }

  // console.log(series)

  if (!(chopts.title || nserie.name)) {
    alert('nothing to show ~~~'); return
  }

  if (!Array.isArray(series)) series = []
  if (!!nserie.name) {
    if (!Array.isArray(nserie.data)) nserie.data = []
    series.push(nserie)
  }
  
  if (!!message.randcolor) {
    console.log('getting random colors...')
    series.map(function (sri) { 
      sri.color = randomColor() })
  }
  
  var cht = chartize(stat_id, chopts)
  if (!names[stat_id]) names[stat_id] = [] 
  // console.log(cht)
  if (series.length) {
    series.map(function (sr) {
      // must check existed serie here!
      if (names[stat_id].indexOf(sr.name) > -1) return
      names[stat_id].push(sr.name) // wonder when things go wrong...
      cht.addSeries(sr, false) 
    }), cht.redraw()
  }
  // if (!!nserie.name) cht.addSeries(nserie, true)
}

chalk.realtime = function (message) {
  var live_id = message.id
  var seridx = message.idx
  var values = message.values
  var shift = message.shift
  var chart = chartize(live_id)
  
  if (!Array.isArray(values)) values = []
  console.log('going to', live_id, values)
  if (!names[live_id]) return

  chart.series.map(function (sr, i, arr) {
    if (seridx != -1 && seridx != i) return
    var _v = seridx != -1 ? values[0]: values[i]
    arr[i].addPoint(_v, false, shift) 
  }), chart.redraw()
}

$(function () {
  var socket = io.connect()
  var ch, itis, noop = function () {}
  var message = {
    success: ['Which to show?']
  }

  socket.on('connect', function () {
    console.log('Connected to statistics!')
    socket.emit('initialisation')
  })

  for (ch in chalk) {
    itis = typeof chalk[ch] == 'function' 
    socket.on(ch, (itis? chalk[ch]: noop))
  }
})
