var cp = require('child_process')
var fs = require('fs'), pt = require('path')
var ng = [
  "positioning/index",
  "xlab/brio/posit",
  "xlab/meshup"
]

var proc = ng.map(eggspawn)

process.on('uncaughtException',
  function () {
    console.log('unknown error accured!')
    console.log(arguments)
    process.exit()
  })

process.on('exit',
  function (code) {
    console.log('exiting w/ code', code)
    proc.map(function (pc) { pc.kill('SIGKILL') })
  })


function eggspawn(name) {
  var one = cp.spawn('node', [name])

  console.log('node', name,
    'spawned to pid#', one.pid)

  one.stderr.on('data',
    function (data) {
      console.log(one.pid + ':stderr',
        data.toString())
    })

  one.stdout.on('data',
    function (data) {
      process.stdout.write(
        one.pid + ':stdout ' +
        data.toString()
      )
    })

  one.on('close',
    function (code) {
      console.log('pid#', one.pid,
        'exited w/ code', code)
    })

  return one
}