require('../mechina')(
  'page4 page.four'
)

var fs = require('fs')
var obser = require('./brio/obser')
var dir = directory(__dirname, 'labor', '1-relay-report')
var fls = fs.readdirSync(dir())

var rmv = ['B66490509B95F91D']

console.log(fls.length, 'files in', dir())
backloop(fls, extractnshow)

function connkey (scanner, target) {
  return [scanner, 'to', target].join(':')
}

function extractnshow (filen, ix) {
  var val, key, scnr, trgt
  var showcase = new obser.stats('clb' + ix, filen) 
  
  fs.readFileSync(dir(filen), 'utf8')
    .split(/[\r\n]+/).map(extract);

  function extract (dataline, ix) {
    // split each line into words
    dataline = dataline.trim().split(' ')
    
    val = +dataline[0]
    trgt = dataline[1]
    scnr = dataline[2] 

    // this would be a negative number
    if (isNaN(val)) return
    // exclude what not interested
    if (rmv.has(trgt)) return

    // create a corresponding key
    key = connkey(scnr, trgt)
    if (streql(key, ':to:')) return

    showcase.concurrent(val, key)
  }
}