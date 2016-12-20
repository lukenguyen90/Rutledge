var stream = require('fs').createReadStream
var pathon = require('path').join
var utilty = require('util')
var walles = require('http').createServer(browsing)
var dataio = require('socket.io')(walles)
var influx = require('./three')
;

dataio.on('connection', iobridge)
walles.listen(influx.port, 
  function (err) {
    if (err) throw err.message // wonder what could happen...
    print(
      'Freight train @', influx.port,
      '! Go Crazy-Safely ♪( ･ｪ･)ﾂ彡(ﾟДﾟ?)'
    )
  })

function iobridge (sio) {
  print('IO departed:', sio.id)
  sio.join('all')

  sio.on(influx.creation, 
    function (enigma) { // only on walls creating
      dataio.emit(influx.creation) })

  influx.bridge.map(
    function (route) {
      var routin = mapping(route)
      // kind of log here
      print('Found route for', sio.id, 'on', routin)
      sio.on(route.input, // one end as inputter 
        function (data) {
          var _id = sio.id.replace(/[\#\/]/g, '')
          data.id = (data.id || '') + _id // additional identification
          // if (data.title) data.title += ' ('+ _id +')' // for showcase
          
          // other one end (wall) as its outputter
          dataio.in('all').emit(route.output, data)

          print( // just for auditting what has been through here
            'Data transitted', routin
          ), console.log(utilty.inspect(data)) // and what data
          
          // if this route has some reply back to inputter
          if (route.reply) dataio.in('all').emit(route.reply)
        })
    })

  sio.on('disconnect', // whenever one end is down... 
    function () { print('IO decamped:', sio.id) })
}

function mapping (info) {
  var _in = ':' + info.input + ':' // from where
  var _out = '(' + info.output + ')' // to where
  return [_in, '-->', _out].join(' ') 
}

function browsing (rqst, resp) {
  // for inspecting full rquest information
  false && console.log('Full request', rqst)

  // what are requested method & url?
  console.log(rqst.method, rqst.url)
  // only serve GET method for now
  if (rqst.method != 'GET') return

  if (rqst.url == '/') filestream('index.html')
  if (rqst.url == '/paper') filestream('paper.html')
  if (fileload(rqst.url)) filestream(rqst.url)

  function filestream (fp) {
    var sources = [__dirname, 'wall', fp]
    // is there any large file available?
    return stream(pathon.apply({}, sources)).pipe(resp)
  }

  function fileload (url) { 
    return (/^\/?javascripts/).test(url) 
  }
}

function print () { // just for fun
  prword(influx.prefix || '!!!')
  for (var ow in arguments) prword(arguments[ow])
  process.stdout.write('\n')
}

function prword (w) { process.stdout.write(w + ' ') }