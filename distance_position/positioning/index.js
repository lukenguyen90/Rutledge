// all fundamental components for running
var Legos = [
  'title', 'examine',
  'pinpoint', 'numberize', 'message',
  'positioning', 'linker', 'database'
]
////////////////////////////////////////////////////////////////////////////

// requisite data loading
var Box = require('./box')(Legos)
var Stage = process.env.NODE_ENV || "local"
var Griden = process.env.GRID == 'on'
var Entries = require('../page/zero')
var Topics = Entries.channel

Box.database.connect(
  Entries.database['development'],
  function (err) {
    if (err) { console.log(err); return }
    Box.title('Database is already up!')
  }
)

var Linker = Box.linker(Entries.broker[Stage])
var resulting = Linker.sendto(Topics.posimap)
var sonarmap = Topics.sonar ? Linker.sendto(Topics.sonar) : null

var system = {}, lasts = {}
var techniq = 'squares'
var nofstcs = 4 // number of statics

Linker.listen(Topics.calibre).do(function (data) {
  // Box.title('some data coming')
  var infs = JSON.parse(data)
  Box.examine(infs)

  if (!infs.target | !infs.scanner | !infs.distance) return
  if (!(system[infs.target] instanceof Object)) system[infs.target] = {}

  // becuase no need of keeping track of static position
  Box.database.static(infs.target,
    function (err, data) {
      if (err) { Box.examine(err); return }
      if (data.length > 0) return
      position(infs.target, infs.scanner, infs.distance, infs.realpos)
    })
})

function position(deviceID, neighborID, distance, realpos) {
  // console.log("lots of check here")
  if (!Array.isArray(lasts[deviceID])) lasts[deviceID] = []

  Box.database.static(neighborID,
    function (err, data) {
      if (err) { Box.examine(err); return }
      if (!data[0]) return

      var coord = Box.numberize(data[0]['coordinates'])
      var mobsys = system[deviceID]

      if (!mobsys[neighborID]) {
        mobsys[neighborID] = Box.pinpoint(coord, distance)
        mobsys[neighborID].id = neighborID
      } else { // adjustment here
        mobsys[neighborID].p = coord
        mobsys[neighborID].rd = distance
      }

      var cursys = Object.keys(mobsys).
        map(function (kp) {
          return mobsys[kp]
        }).sort(function (kpbef, kpaft) {
          return kpbef.rd - kpaft.rd
        })

      var result = locating(deviceID, cursys)
      if (!result) return // If there isn't any result

      var dvpos = result[techniq]
      if (typeof dvpos == 'undefined') return
      // wonder if this is the case here
      var lasttime = lasts[deviceID][0] || []
      // if (!dvpos[0] || !dvpos[0]) dvpos = lasttime
      // if (dvpos[0] == null || dvpos[1] == null) dvpos = lasttime
      if (isNaN(dvpos[0]) || isNaN(dvpos[1])) dvpos = lasttime
      lasts[deviceID].unshift(dvpos)

      Box.database.device_name(deviceID,
        function (err, resdata) {
          resdata = resdata[0]
          if (typeof resdata != 'object') {
            resdata = { id: deviceID }
          } // hmph...

          // what will it be if it has no its name anyway
          resdata.position = dvpos
          if (!resdata.name | !resdata.name.length) 
            resdata.name = 'tag_' + deviceID.slice(0, 4)
          resulting.data(resdata)
          // reset for this deviceID
          system[deviceID] = {}

          if (sonarmap == null) return
          // expect data on sonar radio 
          var sonar = {
            pins: cursys,
            node: {
              id: deviceID,
              name: resdata.name,
              coord: result
            }
          }
          if (Array.isArray(realpos))           
            sonar.node.coord.actual = realpos;
          sonarmap.data(sonar)
          // end of sonar expecting
        })
    });
}

////////////////////////////////////////////////////////////////////////////

function locating(deviceID, system) {
  if (!deviceID || (system.length < nofstcs)) return
  Box.title('Processing system')
  Box.examine(system)

  var results = {
    trilat: GeoLocate('Trilaterate', system),
    circles: GeoLocate('CircusFencing', [system]),
    nearby: GeoLocate('NearIntersect', system),
    squares: GeoLocate('SquareBordering', system)
  }

  Box.title(deviceID, 'Results')
  Box.examine(results)

  return results
}

function GeoLocate(method, args) {
  var pntX = Box.positioning[method].apply(null, args)
  return Griden ? Box.positioning.gridpos(pntX) : pntX
}