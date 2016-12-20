function div (cid, w, h) {
  var one_div = [
    "<div", "id='" + cid + "'", "class='chart'",
    "style='margin: 0; padding: 0; width: 100%; height: 560px;'" ,
    "></div>"
  ].join(' ')
  return '<hr><hr>' + one_div
}

function chartize (cid, chopts) {
  var chid = 'stat_' + cid

  if (typeof $('#' + chid).highcharts() != 'object') {
    $('#valuecharts').prepend(div(chid))
    $('#' + chid).highcharts(crechart(chopts || {}))
  }
  // console.log(lines)
  return $('#' + chid).highcharts()
}

function crechart (opts) {
  var ctitle = opts.title || 'Sample data'
  var cseries = opts.series || []
  return {
    chart: {
      // type: 'scatter'
    },
    title: {
      text: ctitle,
      // x: 80, y: 20, align: 'left',
      // floating: true,
      style: { fontWeight: 'bold' }
    },
    xAxis: {
      labels: { enabled: true }
    },
    yAxis: [{
      lineWidth: 1,
      opposite: true,
      title: { 
        text: "tape 1",
        enabled: false 
      }
    }, {
      lineWidth: 1,
      title: { 
        text: "tape 2",
        enabled: false 
      }
    }],
    tooltip: {
      crosshairs: [true, true], // [x (vertical), y (horizontal)]
      shared: true,
      pointFormat: "<span style=\"color:{series.color}\">{series.name}</span>: <b>{point.y}</b><br/>"
    },
    series: cseries,
    legend: {
      layout: 'horizontal', 
      // align: 'right',
      // verticalAlign: 'right', 
      borderWidth: 0
    }
  }
}

function randomColor() {
  var r, b, g, s = 0.72, l = 0.5
  var h = Math.round(Math.random()*360)
  var hq = (+h.toFixed(3))/60
  var c = (1 - Math.abs(2*l - 1))*s
  var x = (1 - Math.abs(hq%2 - 1))*c
  var m = l - 0.5*c
  var revert = function (x) {
    return Math.round((x + m)*255).toString(16)    
  }

  switch (Math.floor(hq)) {
    case 6:
    case 0: r = c, g = x, b = 0; break;
    case 1: r = x, g = c, b = 0; break;
    case 2: r = 0, g = c, b = x; break;
    case 3: r = 0, g = x, b = c; break;
    case 4: r = x, g = 0, b = c; break;
    case 5: r = c, g = 0, b = x; break;
    default: r = 0, g = 0, b = 0; break;
  }

  return '#' + revert(r) + revert(g) + revert(b)
}

function maskedColor() {
  return ('#rrggbb').replace(/[rgb]/g, rand)
  function rand () {
    return ((Math.random()*16) | 0).toString(16)
  }
}
