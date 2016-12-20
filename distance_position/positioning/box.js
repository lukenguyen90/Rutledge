var Path = require('path')

var _place = 'components', lego = {}
module.exports = function (pieces) {
  if (!Array.isArray(pieces)) {
    pieces = String(pieces).replace(/\s+/g,'').split(',')
  }
  
  pieces.map(finding)
  var all = Object.keys(lego)

  return all.length > 1 ? lego : lego[all[0]]
}

function finding (piece) {
  switch (piece) {
    case 'message':
      lego[piece] = function (devID, coord) { 
        return { mobile:devID, position:coord } 
      }
      break
    
    case 'pinpoint':
      lego[piece] = function (coord, d) { return { p:coord, rd:+d } }
      break

    case 'examine':
      lego[piece] = function (obj) { 
        for (var s in obj) console.log(s + '=', obj[s]) 
      }
      break

    case 'title':
      lego[piece] = function (title, subtitle) {
        if (!subtitle) subtitle = title, title = new Date().toLocaleString()

        title = '(( ' + title + ' ))',
        subtitle = subtitle + ' . . .',
        console.log(title, subtitle)
      }
      break

    case 'numberize':
      lego[piece] = function (n_str) {
        var numbiz = function(e) {return +e}
        return n_str.split(',').map(numbiz)
      }
      break

    default:
      var wh = Path.join(__dirname, _place, piece)
      lego[piece] = require(wh)
      break
  }
}