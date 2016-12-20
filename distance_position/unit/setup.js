require('../mechina');

// neccessary functions at runtime 
var runenv = page0.variation
var routes = page0.channel
var modelr = load.calc('mdbox')
var filter = load.calc('kfilter').filter

// create data link to external processor
var dbconn = load.link('dbconn')('development').connect()
var actvmq = broker(state).connect()
var result = actvmq.sendto(routes.calibre)
var pattrn = actvmq.sendto(routes.rxmodel)

// some minor helpers for this script
var page = directory(__dirname, '..', 'page')
var fs = require('fs'), params = page('params.json')
var timech = clock(), setup = page.bind(null, 'params')
var memomap = paramload(), xclude = [], special
var wheelr = streql.bind(null, runenv.wheelr || process.env.WHEELR)
var height = +(runenv.h || runenv.height) || 1

// create & assign loaded values
if (Object.keys(memomap).length) {
  print('LOADED!\n') // simple mark
  eachprop(memomap, function (dvid, model) {
    print('*** Loading values for', dvid, '\n')
    // load log-distance models
    memomap[dvid] = modelcreation()
    copy(model.logmd, memomap[dvid].logmd)
    // load previous filter states
    eachprop(model.filter, function (dvc, data) {
      memomap[dvid].filter[dvc] = new filter(runenv)
      copy(data, memomap[dvid].filter[dvc])
    })
  })
}

dbconn.query({ // the one that starts all
  // sql: 'select ??, ??, ?? from `device_deployment`',
  // values: ['deviceid', 'coordinates', 'type']
  sql: 'SELECT d.?? as ??, d.?? as ??, t.?? as ?? \
    FROM `device` d LEFT JOIN `type` t ON d.`typeid` = t.`id`',
  values: ['chipid', 'deviceid', 'coordinates', 'coordinates', 'title', 'type']
}, function (devices) {
  mapping(devices) // setup some initial data
  console.log('!!! Devices excluding', xclude.join(' '))
  actvmq.listen(routes.borderbasket).do(processing) // real run here
  timesave() // save memomap periodically here
})

function mapping(devices) {
  print('&&& Founding d-map for',
    devices.length, 'devices!\n')

  // get (the) special one(s) first!
  special = devices.filter(
    function (dv) {
      return streql(dv.type, 'special')
    })[0]
  // simple check here
  if (itis.Empty(special))
    throw new Error("No special device!")
  console.log('&&& Special device:',
    special = special.deviceid)

  // process queried devices' data
  devices.map(
    function (dv) {
      var _id = dv.deviceid
      switch (lower(dv.type)) {
        // no need of server here
        case 'server': xclude.push(_id); break
        case 'relay':
          xclude.push(_id) // may not really want to see relays
          if (itis.Object(memomap[_id])) break
          console.log('&&& New creation for', _id)

          // new creation for the relay
          memomap[_id] = modelcreation(),
            memomap[_id].logmd.devic = special

          backloop(['start', 'envrm'],
            function (tp) { // convert from 2d to real 3d
              var _d = memomap[_id].logmd[tp].d
              memomap[_id].logmd[tp].d = fiz(cathetus(_d), 2)
            })
      }
    })
}

function processing(data) {
  var addr = memomap[data.scanner]
  if (!itis.Object(addr)) return
  // need 2 handle when new one comes in
  if (xclude.has(data.target)) return // specify what's excluded

  if (!addr.filter[data.target])
    // each pair of devices makes use of one filter process 
    addr.filter[data.target] = new filter(runenv);

  // just filter it! no care of checked filter or not?
  data.filtered = addr.filter[data.target].value(data.rssi)
  // the true one that is used for next procedures
  var value = data[runenv.filter ? 'filtered' : 'rssi']

  print( // start of the log line
    clock.shortstamp(new Date(data.time)),
    data.scanner, data.target, data.rssi, value, ''
  )

  // step#1: calibration, when target is the special one
  if (streql(special, data.target)) {
    var _dt = addr.timing.click() // get the time difference
    // `wheelr` is used as a switch here
    if (itis.Empty(addr.logmd.initx) && wheelr('init')) {
      addr.logmd.base(value, special) // 'A' basing from received rssi
      if (!!addr.logmd.initx) { // when it is init-ed
        print('(' + addr.timing.duration + ') ')
        addr.timing.stopwatch() // reset time watcher
      }
    }

    // when collect during the time of env. characterizing 
    var _tsl = data.scanner.slice(0, wheelr.length)
    if (wheelr('env') | wheelr(_tsl)) {
      // get to see the pattern once the scanner's model is done
      var rxmdl = addr.logmd.characterize(value, special);
      if (itis.Object(rxmdl)) {
        rxmdl.scanner = data.scanner
        pattrn.data(rxmdl);
      }
    }
  } // runs everytime the special is seen as target
  // params saving here 6( ^ . ^ )  
  if (wheelr('init') | wheelr('env')) savememo(params)

  // step#2: distance calculation
  data.distance = dbending(+addr.logmd.distance(value))
  // if it's NaN, just delete it!
  if (isNaN(data.distance)) delete data.distance
  else data.distance = fiz(data.distance, 2)
  print('d=', +data.distance, '\n') // got inspect it
  result.letter(data) // end of the routine
}

function timesave() {
  !fs.existsSync(setup()) && fs.mkdirSync(setup());
  var date, time, timeon = setInterval(function () {
    if (!wheelr('init') &
      !wheelr('env') &
      !wheelr('start')) return

    date = timech.shortdate.replace(/\//g, '.');
    time = timech.time.replace(/(:|\s)/g, '.');

    !fs.existsSync(setup(date)) &&
      fs.mkdirSync(setup(date)); // mkdir of runtime date
    savememo(setup(date, time) + '.json') // can it be helpful??
  }, clock.minutes(+(runenv.timesave) || 1)) // 1 min period! (or more?!)
}

/** mini functional parts */

// post-manipulate calculated distance
function dbending(d) {
  var bended = hypotenuse(d)
  if (!process.env.EXACTLY)
    bended += Math.random() * 0.1 + 0.1;
  return bended // still NaN if `d` is NaN
}

function cathetus(d) {
  return Math.sqrt(d * d + height * height)
}

function hypotenuse(d) {
  return d <= height ? d :
    Math.sqrt(d * d - height * height)
}

function modelcreation() {
  return {
    filter: {},
    logmd: new modelr(runenv),
    timing: clock().stopwatch(),
  }
}

function paramload() {
  try {
    print('*** Finding old params... ')
    return require(params)
  } catch (e) {
    // console.log('actual error:', e)
    print('Nothing loaded!\n')
    return {}
  }
}

function savememo(filename) {
  fs.writeFile(
    filename, // file name must be passed
    JSON.stringify(memomap),
    errorhandle)
}

function errorhandle(err) {
  if (itis.Empty(err)) return
  var timeon = clock.shortstamp()
  console.error(timeon, err.message)
  console.error('Stacktrace:', err.stack, '\n')
}

/** end of mini section */