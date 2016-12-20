var fs = require('fs').readFileSync
var pt = require('path').join
var net = require('net')

var timgo = '12/10/2016 17:16:35', start = false
var scken = '*** Socket opened', bulk = false

var dalog = '12.10.2016', xtrac = 'raw:', find
var relog = [__dirname, 'relog', dalog]
var pathx = pt.apply({}, relog.concat('unit.tcpin.log'))

var datab = fs(pathx, 'utf8').
  split(/\r?\n/).map(function (line) {
    if (bulk) return ''

    line.indexOf(timgo) == 0
      && !start && (start = true);
    if (!start) return ''

    find = line.indexOf(xtrac)
    if (find < 0) {
      line.indexOf(scken) == 0 &&
        start && (bulk = true); 
      return ''
    }

    find += xtrac.length + 2
    return line.slice(find, -2)
  }).filter(function (line) { return line.length > 0 })
console.log('Data logged length:', datab.length)

var server = net.createServer(
  function (socket) {
    console.log('!!! Some client is connected!')
    // console.log(socket)
  })

server.on('connection',
  function (socket) {
    var stop = false
    socket.on('close', interuption)
    socket.on('error', interuption)

    var i = 0, inv = setInterval(
      function () {
        console.log('write to socket...',
          datab[i].toString())
        socket.write(datab[i++])

        if (stop || i == datab.length) {
          clearInterval(inv), socket.end()
          console.log('Data stream ends!')
        }
      }, 202)

    function interuption() {
      process.stdout.write('!!! Cli-conn is interrupted')
      console.log(arguments), stop = true
    }
  })

server.on('error',
  function (err) {
    console.log('!!! ERROR!', err)
    throw err
  })

server.listen(
  4901, '172.16.0.108',
  function () {
    console.log('!!! Pseudo-server board is up')
  })