var Events = require('events').EventEmitter
var MQTT = require('mqtt')
var subscribed = []

var connect = function (broker, sub_topics) {
  if (Array.isArray(sub_topics)) subscribed = sub_topics

  var retry = 7
  var linker = MQTT.connect(broker)
  linker.channel = new Events()

  // define handlers for 'physical' events
  linker.on('connect', function (connack) {
    // if nothing can carry this
    if (connack.returnCode) {
      console.log(connack)
      linker.end()
    }
    // everything is clear
    var timestamp = new Date().toLocaleString()
    process.stdout.write('(( '+timestamp+' )) Broker-link success, now online\n'),
    process.stdout.write('address= '+broker.host+':'+broker.port+'\n'),
    process.stdout.write('run as client= '+linker.options.clientId+'\n')
    // (re)subscribe topics 
    for (var i in subscribed) {
      var topic = String(subscribed[i])
      linker.subscribe(topic)
    }
  })

  linker.on('message', function (topic, message, packet) {
    // console.log('\n(( Message listened on <', topic, '> ))')    
    message = message.toString() // convert to a proper message string
    linker.channel.emit(topic, message) // forward to individual channels
  })

  linker.on('reconnect', function () {
    console.log('(( Re-link to broker ('+(retry--)+') ))')
  })

  linker.on('offline', function () {
    console.log('(( Broker gone offline ))')
  })

  linker.on('close', function () {
    console.log('(( Broker-link off ))') 
    if (retry === 0) linker.end()
  })

  linker.on('error', function (err) {
    console.log('((( ERROR )))', err.message), console.log(err.stack)
  })

  return linker
}

module.exports = function (broker, sub_topics) {
  var linker = connect(broker, sub_topics)
  
  linker.listen = function (topic) {
    topic = String(topic)
    if (subscribed.indexOf(topic) < 0) {
      subscribed.push(topic)
      linker.subscribe(topic)
    }

    return { 
      do: function (func) {
        if (typeof func != 'function') return
        linker.channel.on(topic, func)
      }
    }
  }

  linker.sendto = function (topic, opts) {    
    topic = String(topic)
    
    return {
      data: function (message) {
        message = JSON.stringify(message)
        linker.publish(topic, message, opts, function () {
          // console.log('\n((', 'Message sent to <', topic, '> !!'), 
          console.log('message=', message)
        })
      }
    } 
  }

  return linker
}