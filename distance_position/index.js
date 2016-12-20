var cp = require('child_process')
var fs = require('fs'), pt = require('path')
var ng = require('./page/zero').onerun

// var repo = pt.join.bind(null, __dirname)
var xlog = pt.join.bind(null, __dirname, 'xlog')
if (!fs.existsSync(xlog())) fs.mkdirSync(xlog())
var time = xlog.bind(null, datestamp())
if (!fs.existsSync(time())) fs.mkdirSync(time())

console.log('run @', new Date().toLocaleString())

var proc = ng.map(
  function (script) {
    var isarray = Array.isArray(script)
    var vals = isarray? script.join(' '): script
    process.stdout.write("node " + vals + '... ')
    // return eggspawn(repo(script))
    return eggspawn(script, isarray)
  })

process.on('uncaughtException',
  function () {
    console.log('unknown error accured!')
    console.log(arguments)
    process.exit()
  })

process.on('SIGINT', 
  function () {
    console.log('interrupted', arguments)
    process.exit()
  })

process.on('exit', 
  function (code) {
    console.log('exiting w/ code', code)
    proc.map(function (pc) { pc.kill('SIGINT') })
  })

function eggspawn (script, isarray) {
  if (!script) throw "Am I kidding myself?!"

  var _out = openlog(String(script))
  var opts = { stdio: ['ignore', _out.log, _out.err] }
  var prms = ['node', (isarray? script: [script]), opts]
  var unit = cp.spawn.apply({}, prms)

  console.log('spawned to pid#' + unit.pid)

  return unit
}

function openlog (filen) {
  // filen = filen.slice(repo().length + 1)
  // filen = filen.replace(/\//g, '.')
  filen = filen.replace(/[\/\s-:,]+/g, '.')

  return {
    log: fs.openSync(time(filen + '.log'), 'a'),
    err: fs.openSync(time(filen + '.err'), 'a')
  }
}

function datestamp () {
  var datetime = new Date()
  return [
    datetime.getDate(), 
    datetime.getMonth() + 1, 
    datetime.getFullYear()
  ].join('.')
}