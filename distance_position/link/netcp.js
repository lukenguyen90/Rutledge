var net = require('net')

function netClient (opts, onData) {
  // variables at runtime
  var host = opts.host 
  var port = opts.port || 4901 // must be a valid port
  var _pre = opts.prefix || '***'
  var time = +opts.timeout || 2000 // in miliseconds

  var netsock = { write: undefined }
  var lognetk = console.log.bind({}, _pre)
  
  if (isfunc(onData)) openSocket()
  else {
    netsock.open = function (late_handler) {
      if (isfunc(late_handler)) onData = late_handler
      openSocket()
    }
  }

  return netsock // everything is fine now

/**
 * thanks to @coder branneman
 * @source https://gist.github.com/branneman/0a77af5d10b93084e4f2
 */

  function openSocket () {
    // no need of control over this
    // let it be in self-control
    var socket = net.connect(port, host)
    // some pre-setting
    socket.setKeepAlive(true)
    socket.setEncoding('utf8') // good, but not for handler?!
    socket.setTimeout(time)

    // event bindings
    // call bind-s for avoiding unwanted `this` somewhere
    socket.on('connect', onConnect.bind({}, socket))
    socket.on('error', onError.bind({}, socket))
    // new added bindings
    socket.on('close', onClose.bind({}, socket))
    socket.on('data', onData.bind({}))
    
    // make socket self-control, so this'd be efficient
    netsock.write = onWrite.bind({}, socket)
  }

  function onConnect (socket) {
    lognetk(
      'Socket opened @',
      socket.remoteAddress + ':' + socket.remotePort
    )
  }

  function onError (socket, err) {
    lognetk('Error on socket, code:', err.code)
    // Kill socket
    socket.destroy(), socket.unref()
    // Re-open socket
    setTimeout(openSocket, time)
  }

  // additional event handlers

  function onClose (socket, trans_err) {
    var message = ['Socket is closed']
    if (trans_err) message.push('due to transmission error')
    lognetk.apply({}, message)
  }

  function onWrite (socket, data) {
    // only allow string type to write downstream
    socket.write(String(data))
  }
}

function isfunc (varname) {
  return typeof varname == 'function'
}

if (module.parent) { 
  module.exports = netClient;
  ['isIP', 'isIPv4', 'isIPv6'].map(
    function (tip) {
      netClient[tip] = net[tip]
    }
  )
} else {
  var opts = { host:'172.16.0.125' }
  var client = netClient(opts)
  client.open(simhandler)
  // or just 
  // var client = netClient(opts, simhandler))

  setInterval(function () {
    client.write('info\r\n')
  }, 1000)
}

function simhandler (data) {
  process.stdout.write(new Date() + ' ')
  console.log(data.replace(/(\s+)?\r\n$/, ''))
}