if (!module.parent) throw "Broker can't be alone!!"

var MQTT = require('mqtt')
var BrokerConf = page0.broker
var OuterLink = { // the most dependent script!!

  config: function (state, sub_topics) {
    this.state = (state in BrokerConf)? state: "local"
    this.conf = BrokerConf[this.state]
    this.subs = Array.isArray(sub_topics)? sub_topics: []
    
    return this
  },

  connect: function () {
    if (!this.conf) throw new Error('No configuration!')

    this.link = BrokerConnection(this.conf, this.subs)
    this.link.on('message', handler)
    
    return this

    function handler (topic, message) {
      // first, parse the message to proper string
      message = message.toString() // 'cuz it's just a buffer!
      // then try to turn into proper object data
      try { message = JSON.parse(message) } 
      catch (e) {} // doz it need err handling anw ?!

      // forward to individual channels (right behavior delegation?) 
      process.emit(separate(topic), message)
    }
  },

  listen: function (topic) {
    if (!this.link) throw new Error('No link available!')

    // middle process for later re-connecting
    topic = String(topic)
    if (this.subs.indexOf(topic) < 0) {
      this.subs.push(topic),
      this.link.subscribe(topic)
    }

    // real handler for this topic 
    var listeners = { 'do': handler }
    aliasing(listeners, "do process")
    return listeners
    // return { 
    //   do: handler,
    //   process: handler 
    // }

    function handler (func) {
      if (!itis.Function(func)) return
      process.on(separate(topic), func)
    }
  },

  sendto: function (topic, opts) {
    if (!this.link) throw new Error('No link available!')
        
    topic = String(topic)
    var link = this.link

    var senders = { "message": handler }
    aliasing(senders, "message letter data")
    return senders
    // return { 
    //   message: handler,
    //   letter: handler 
    // }

    function handler (data) {
      link.publish(topic, JSON.stringify(data), opts)
    }
  },

  end: function () {
    if (this.link) this.link.end()
  }

}

var aliases = [ 
  // make some aliases inside OuterLink
  "connect start begin",
  "listen on over subscribe",
  "sendto forward emit publish",
  "end close"
]

// aliases.map(aliasing.bind({}, OuterLink))
synonyms(OuterLink, aliases)

// some interesting thing
module.exports = function (init) {
  var opts = itis.Object(init)
  var state = opts? init.state: String(init)
  var subs = opts? init.subs: []
  return Object.create(OuterLink).config(state, subs)  
}

function separate (topic) { return 'broker:' + topic }

function BrokerConnection (conf, subs) {
  var conn = MQTT.connect(conf)
  var retry = +(conf.retry || conf.times) || Infinity
  var _pre = conf.prefix || ')))'
  
  // all mqtt events' handlers
  var handlers = {

    connect: function (connack) { // when the link is first created
      if (connack.returnCode) { // if nothing can carry this
        throw new Error('Return code:', connack.returnCode)
      } 
      // everything is clear
      console.log(_pre, 'Linked @', conf.host + ':' + conf.port)
      // (re)subscribe topics
      subs.map(function (st) { conn.subscribe(String(st)) })
    },

    reconnect: function () { // effort at re-linking
      console.log(_pre, 'Link recyclin\'', --retry) 
    },

    offline: function () { // link is in offline state
      console.log(_pre, 'Link stated offline') 
    },

    close: function () { // link is closing off
      console.log(_pre, 'Link goin\' down')
      if (retry == 0) conn.end() 
    },
    
    // pray for some errors not in happening
    error: function (err) { throw err }

  }

  handlers.each(conn.on.bind(conn))
  return conn // finish initialising
}