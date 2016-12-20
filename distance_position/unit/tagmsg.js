require('../mechina')

var isIPv6 = require('net').isIPv6
var isChipID = function (str) {
  return /^[abcdef\d]{16}$/.test(lower(str))
}
var box = { // will it be easier to change ? 
  in: { tag: 'staff', msg: 'message' },
  out: { tag: 'mobile', rsp: 'response' }
} // ... or, make some struggles??
var cache = { 
  ip_list: {}, tag_list: [], // some fundamental lists
  response: {}, texted: [] // track of 'text' command
}

var linker = broker(state).connect()
var stream = {
  // from this point back to gecko server connection 
  back: linker.forward(page0.channel.backstream),
  // detect a reply from rough data after sending,
  // and reply back to the place of sender
  reply: linker.forward(page0.channel.textreply)
}

linker.on(page0.channel.batmon).do(aggregate)
linker.on(page0.channel.texting).do(destine)
linker.on(page0.channel.roughdata).do(backwardreply)

function aggregate(data) {
  if (isIPv6(cache.ip_list[data.tag_id])) return;
  tag_list.push(data.tag_id) // this may be useful at later time
  cache.ip_list[data.tag_id] = data.ipv6
}

function destine(data) {
  // what to do here?! ... what if IP is used instead at later time?!
  var tag_ip = isChipID(data[box.in.tag]) ? cache.ip_list[data[box.in.tag]] : null
  if (!itis.Empty(tag_ip)) return // wonder when it's still not one...
  cache.texted.push(data[box.in.tag]) // how to keep track properly?  
  text(tag_ip, data[box.in.msg])

  function quote(str) { return '"' + str + '"' }
  function text(ip, msg) {
    var prms = [ip, "cli/msg", msg].map(quote)
    prms.unshift('text'), stream.back.data(prms.join(' '))
  }
}

function backwardreply(data) {
  // what if there'll be lots of texting processes?
  // would it be this simple?! can't never be!!!
  data = data.raw.split(' ')
  if (!streql(data[0], 'text')) return
  // response message hasn't been defined yet
  cache.response[box.out.tag] = cache.texted.slice(-1)[0]
  cache.response[box.out.rsp] = !+data[1] ? 'OK' : 'Failed'
  stream.reply.data(cache.response) // how much complex it'll be...
}