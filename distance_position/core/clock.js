module.exports = init

function init() {
  return new horologium()
}

init.clock = clock
init.shortstamp = shortstamp
init.minutes = function (x) {
  return (+x || 0) * 60 * 1000
}

function clock() {
  var quartz = { now: new Date() }
  // needed properties
  quartz.time = quartz.now.toLocaleTimeString()
  quartz.date = quartz.now.toLocaleDateString()
  quartz.shortdate = shortstamp(quartz.now).split(' ')[0]
  // end of property definings
  return quartz
}

// short datetime stamp
function shortstamp(datetime, printout) {
  // `datetime` is an obj of Date
  // if (!(datetime instanceof Date)) datetime = new Date()
  // !(datetime instanceof Date)? (datetime = new Date()): null;
  datetime instanceof Date ? null : (datetime = new Date());
  // !(datetime instanceof Date) && (datetime = new Date());

  var time = datetime.toLocaleTimeString()
  var stamp = [
    datetime.getDate(),
    datetime.getMonth() + 1,
    datetime.getFullYear()
  ].join('/') + ' ' + time

  if (!!printout) process.stdout.write(stamp + ' ')
  return stamp
}

function caesiumradiate(horologe) {
  /**
   * thanks to @coder Austin Brunkhorst
   * @source http://stackoverflow.com/questions/23894255/is-there-an-elegant-way-to-implement-a-clock-update-event
   */

  var SECS = 1000 // like an internal force of the world!!
  resonating() // very first resonant sound

  function resonating() {
    var unclok = clock(), qp
    var sero = SECS - (unclok.now % SECS)
    for (qp in unclok) horologe[qp] = unclok[qp]
    // self-timeout-call function is interesting
    setTimeout(resonating, sero) // original
    // setTimeout(resonating, SECS) // this's behind reality
  }
}

function horologium() {
  caesiumradiate(this)
  // horologium.prototype = {} // why did i need this anw?
}

// simple formatting
function eyelook(clock, printout, with_date) {
  var face = clock.time
  if (with_date) face += ' on ' + clock.date
  if (!printout) return face
  process.stdout.write('it\'s ' + face + ' ')
}

// at least, i have to see it clear :D
horologium.prototype.facet = function () {
  // interesting js functions!!!
  eyelook.bind({}, this).apply({}, arguments)
  // need to figure out why binding is needed first?!
  // sep 29, add: not really sure if it has smth w/ `caesiumradiate`
  return this
}

horologium.prototype.shortstamp = function (view) {
  return shortstamp(this.now, view)
}

horologium.prototype.stopwatch = function () {
  this.clicks = [] // start resetting things
  this.tick = this.tock = undefined
  this.duration = this.diff = undefined
  // later calls will erase all previous efforts
  return this
}

horologium.prototype.watchdone = function () {
  var tracks = {}

  if (Array.isArray(this.clicks) &&
    this.clicks.length > 0) {
    tracks.points = this.clicks
    tracks.clicked = this.clicks.length
    tracks.start = this.clicks[0].now
    tracks.end = this.clicks.slice(-1)[0].now
    tracks.runtime = this.duration
    this.stopwatch() // start resetting things
  }

  return tracks
}

horologium.prototype.click = function (_view) {
  if (!Array.isArray(this.clicks)) return
  this.clicks.push(clock().now)

  this.tock = this.clicks.slice(-1)[0]
  this.tick = this.clicks.slice(-2, -1)[0] || this.tock
  this.diff = (this.tock - this.tick) / 1000

  var start = this.clicks[0]
  this.duration = (this.tock - start) / 1000

  if (!!_view) console.log(
    'tick=' + this.tick,
    'tock=' + this.tock,
    'diff=' + this.diff,
    'duration=' + this.duration
  )

  return this.diff
}

if (!module.parent) {
  // simple-enough testing
  var atomiclock = init()
  var nowhere = Math.random() * 10000

  atomiclock.facet(true, true).stopwatch()
  process.stdout.write('\n')

  var time = shortstamp()
  console.log(time.replace(/[\/\s:]+/g, '.'))

  setInterval(function () {
    console.log(
      'wat time now?',
      eyelook(atomiclock, null, true)
    ), atomiclock.click(true)
  }, 1000)

  setTimeout(function () {
    var clok = clock()
    console.log(clok)
    console.log(
      '!!! after', nowhere, 'secs!',
      eyelook(clok, null, true)
    )
  }, nowhere)
}