require('../../mechina')(
  'page4 page.four', 'link.broker'
)

var mighty = page4.mighty, custom = page4.custom
var server = [], dasink = streql.bind(null, 'server')
backloop([mighty, custom],
  function (brdver) {
    brdver.tag = [], brdver.relay = []
    eachprop(brdver.serials,
      function (sn, brd) {
        if (dasink(brd[1])) server.push(brd[0])
        if (!(brd[1] in brdver)) return
        brdver[brd[1]].push(brd[0])
      })
  }), false && console.log(mighty, custom)

var argex = require('minimist')(process.argv.slice(2))
var title = argex.t || argex.title || ''
var ispec = argex.inspect ? String(argex.inspect) : ''
var ccrnt = (argex.run || page4.run) == 'concurrent'
var dline = (+argex.timer || page4.timer) * 1000 // to ms
var filen = argex.f || argex.file || argex.filename

var ipass = passgate()[ispec]
if (itis.Empty(ipass)) ipass = function (devc) {
  var dv = String(devc).slice(0, ispec.length)
  return !dv.length ? true : streql(dv, ispec)
}

filen = !filen ? '' : String(filen)
if (!title.length) title = filen.length ? filen : 'rssi collecting'

var labog = directory(__dirname, '..', 'labor')
// logfile writing handler
var fhand = !filen.length ? null :
  require('fs').createWriteStream(labog(filen),
    { flags: 'a', defaultEncoding: 'utf8' })
// console.log(filen, fhand); return
if (!!fhand) console.log('writing to file', filen)

var mode = streql.bind(null, process.env.MODE)
var update = ccrnt ? 'concurrent' : 'update' // updating method
console.log('collect & show type:', update)

var obser = require('./obser')
var actmq = broker(process.env.NODE_ENV).connect()

var _k, streamed, time, start
var multi = new obser.stats('labor', title)
var tunne = mode('raw') ? 'borderbasket' : 'calibre'
console.log('listening to channel', page0.channel[tunne])
actmq.on(page0.channel[tunne]).process(porter)

if (!mode('setup')) return

var mdttl = 'RSSI Log-distance models', mdnme
mdttl += ', ' + clock.shortstamp()
var logmd = new obser.stats('labormd', mdttl)
actmq.on(page0.channel.rxmodel).process(modeller)


function porter(data) {
  if (!start) start = Date.now()
  // whether data.target is wanted or not
  if (!data.target || !data.scanner) return
  // console.log(data)
  if (!ipass(data.target)) return
  // need to inspect this again
  // console.log(data.time, data.raw)

  time = clock.shortstamp(new Date(data.time))
  // streamed = [time, data.raw].join(' ') + '\r\n'
  streamed = [time, data.scanner, data.rssi].join(' ') + '\r\n'
  process.stdout.write(streamed)
  if (itis.Object(fhand)) fhand.write(streamed)

  _k = connkey(data.scanner, data.target)
  if (itis.Number(data.rssi))
    multi[update](data.rssi, _k + ':raw', true);
  if (itis.Number(data.filtered))
    multi[update](data.filtered, _k + ':kft', true);

  if (Date.now() - start > dline) process.exit()
}


function modeller(data) {
  // check if there is some pattern
  if (!itis.Object(data)) return
  // may something see this useful 
  itis.Empty(data.scanner) &&
    (data.scanner = 'unknown');
  mdnme = [
    cutoff(data.scanner), 
    data.a, data.d0, data.n
  ]
  // and go & add one more model
  logmd.addserie({
    data: data.log,
    name: mdnme.join(':')
  }, false, true)
}

function connkey(scanner, target) {
  return [cutoff(scanner), 'to', cutoff(target)].join(':')
}

function cutoff(idstr) {
  return String(idstr || '').slice(0, 5)
}

function passgate() {
  return { // check scanned target whether desired or not
    none: function (devc) { return true },
    server: function (devc) { return server.has(devc) },
    tag: function (devc) {
      return mighty.tag.concat(custom.tag).has(devc)
    },
    relay: function (devc) {
      return mighty.relay.concat(custom.relay).has(devc)
    },
    red: function (devc) { return custom.relay.has(devc) },
    green: function (devc) { return custom.tag.has(devc) },
    mob: function (devc) { return mighty.tag.has(devc) },
    gecko: function (devc) { return mighty.relay.has(devc) },
    custom: function (devc) {
      return custom.relay.has(devc) || custom.tag.has(devc)
    },
    mighty: function (devc) {
      return mighty.tag.has(devc) || mighty.tag.has(devc)
    }
  }
}