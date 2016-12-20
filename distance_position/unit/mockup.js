require('../mechina');

var routes = page0.channel
var actvmq = broker(state).connect() // get a communication with the post man
var dbconn = load.link('dbconn')('development').connect()

// var argvex = page0.variation
// var result = actvmq.sendto(routes.calibre) // calculated results
// var filter = load.calc('filterin')

actvmq.
  listen(routes.borderbasket).
  process(function (data) {
    // data handling goes here
    // data = {
    //   raw: '', // raw data from server
    //   time: '', // time string of retrieval
    //   interval: '', // interval from last retrieving
    //   rssi: -0, // negative number
    //   lqi: 255,
    //   longid: '', target: '', // scanned device's ID
    //   longsid: '', scanner: '' // scanner's ID
    // }
    console.log(data)
    // emit to amq:
    // actvmq.link.publish('topic', { data: 'something' })
    // or 
    // actvmq.emit('topic').data('something')
    // value filtering
    // console.log('filtered value:', filter(data, page0.variation))
  })