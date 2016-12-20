require('../mechina');

// activemq connection
var linkee = broker(state).connect() // creation of outspace connection
var stream = {
  // for any rough data handler out there,
  rocky: linkee.forward(page0.channel.roughdata),
  // and one for the data has its own meanings
  scanned: linkee.forward(page0.channel.borderbasket),
  // tag's battery monitor goes here!
  battery: linkee.sendto(page0.channel.batmon)
}

var timee = clock().stopwatch()
var memory = {
  head: null,
  stack: [], heap: {}
} // memory in run

// tcp connection to server boards
var netcp = load.link('netcp')
var client = function geckoserver() {
  // configure interface connected to mighty gecko boards
  // var _ip = +process.env.BORDER_IP || '116' // the only param for now 
  // if (isNaN(_ip)) throw new Error("No board chosen!")
  // page0.border.host += _ip // there's necessary part already
  netcp.isIP(process.env.BORDER_IP) &&
    (page.border.host = process.env.BORDER_IP);
  return netcp(page0.border, datahandler) // connect it!
} () // just to get the `write`-dull

// listen to another command issuer
linkee.on(page0.channel.backstream).do(
  function (data) {
    // simple writing log
    console.log(timee.shortstamp(), 'WRITE:', data)
    // does it need to handle reply?
    client.write(String(data) + '\r\n')
  }
)

// handle received data here
function datahandler(data) {
  // initial manipulate data from board
  data = data.toString().trim()
  data.split(/\s?[\\?\r|\\?\n]+/).map(messaging)
}

// filter what's really needed
function abandon(data) {
  // this'd later be modified as a navigator 
  // to which processes stack next
  var abort = false // final result in here

  // this could be used as some write-switch here!!
  abort |= streql(data, 'server>') // just some random thing
  // abort |= !streql(data[0], '[') // symbol indicating useful data

  return abort // just fill the empty spaces :)
}

// and process splitted data here 
function messaging(data) {
  // data = data.replace(/\s?\r\n$/, '')
  data = data.trim() // just some rough data
  if (abandon(data)) return

  timee.click() // stop the time at each retrieval
  // log data at this interface
  console.log(
    timee.shortstamp(),
    timee.diff, data)

  // first parsing of data 
  memory.heap = { // dynamic data memory
    raw: data, // raw data string retrieved
    time: timee.now, // time of this retrieval
    interval: timee.diff // interval from previous one
  }
  stream.rocky.data(memory.heap) // maybe this just for audittin'

  // temporary memory for splitted data
  memory.stack = data.split(' ')
  // get info about which kind of useful data
  memory.head = lower(memory.stack.splice(0, 1)[0])
  // switch gate here!
  switch (memory.head.slice(1)) {
    case 'bat': mobile_health(); break
    case 'rssi': rssi_scanned(); break
  }
}

// battery data monitor
function mobile_health() {
  // get info from a tag
  memory.heap.tag_id = memory.stack[0]
  memory.heap.ipv6 = memory.stack[3]
  // consisted of battery data
  memory.heap.voltage = +memory.stack[1] // in mV
  memory.heap.percentage = +memory.stack[2]
  
  stream.battery.data(memory.heap)
  console.log('battery:', memory.heap)
}

// scanned rssi value as early parsing stage
function rssi_scanned() {
  memory.stack[0] = +memory.stack[0]
  // this's just for sure
  if (isNaN(memory.stack[0]) | memory.stack[0] >= 0) return

  // assign meanings to splitted data
  memory.heap.rssi = +memory.stack[0]
  // memory.heap.longid = memory.stack[1]
  // memory.heap.longsid = memory.stack[2]
  memory.heap.target = memory.stack[1]
  memory.heap.scanner = memory.stack[2]
  // memory.heap.lqi = +memory.stack[3]
  // end assigning

  // forward it to whatever is interested in
  stream.scanned.message(memory.heap)
  console.log('scanned:', memory.heap)
}