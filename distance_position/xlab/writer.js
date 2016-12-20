require('../mechina')('link.broker')

var linker = broker().connect()
var command = process.argv.slice(2)

for (var i = 1; i < command.length; i++)
  command[i] = quoted(command[i]);
command = command.join(' ')

linker.link.publish(
  page0.channel.backstream, 
  command, function () {
    console.log('after args:', arguments)
    console.log('command:', command)
    linker.link.end() 
  })

function quoted (str) {
  return '"' + str + '"'
}