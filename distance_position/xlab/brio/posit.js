require('../../mechina')(
  'page3 page.three',
  'link.broker' 
)

var dataio = 'http://' + page3.host + ':' + page3.port
var clidio = require('socket.io-client')(dataio)
var hepero = broker(process.env.NODE_ENV).connect()
var ground = process.env.GRID == 'on'

clidio.on('connect', function ()
{ console.log('!!! Data train is through ~') })

hepero.listen(page0.channel.sonar)
  .do(function (data) {
    if (!data.pins && !data.node) return
    // more mnanopulations here

    var comb = [0, 0], count = 0
    data.node.coord.each(
      function (meth, xy, pos) {
        if (dumbpos(xy)) { delete pos[meth]; return }
        if (streql(meth, 'actual')) return
        
        count += 1, 
        comb[0] += xy[0], 
        comb[1] += xy[1]
      }
    ), comb[0] /= count, comb[1] /= count,
    ground && (comb = comb.map(Math.round)),
    data.node.coord.combined = comb

    // end of additions 
    console.log(data.node)
    clidio.emit(page3.radar, data) // forward to radar
  });

function dumbpos(coord) {
  return isNaN(+coord[0]) || isNaN(+coord[1])
}