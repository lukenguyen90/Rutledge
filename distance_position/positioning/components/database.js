var MySQL = require('mysql')
var pool = null

exports.connect = function (dbinf, done) {
  if (typeof done != 'function') done = function (err) { err && console.log(err) }
  if (!(dbinf instanceof Object)) done(new Error('Unknown information'))

  pool = MySQL.createPool(dbinf)

  pool.getConnection(function (conn_err, conn) {
    if (conn_err) done(conn_err)
    else {
      conn.query('SELECT @@version', function (err, rows) {
        if (!err) {
          var dbsvr = rows[0]['@@version']
          conn.release()
          process.stdout.write("Database version= " + dbsvr)
          process.stdout.write(" /address= " + dbinf.host + ':' + dbinf.port + '\n')
        }
        done(err)
      })
    }
  })

  pool.on('connection', function (conn) {
    var timestamp = new Date().toLocaleString()
    process.stdout.write('(( ' + timestamp + ' )) ')
    process.stdout.write('DB-connection on thread= ' + conn.threadId + '\n')
  })

  return pool
}

exports.close = function (func) {
  if (pool) pool.end(func)
}

// exports.static_list = function (func) {
//   var stmt = 'SELECT d.?? as `deviceid`, d.??, t.?? FROM `device` d \
//     LEFT JOIN `type` t ON d.?? = t.?? AND LOWER(t.??) = ?'
//   var vals = ['chipid', 'coordinates', 'title', 'typeid', 'id', 'title', 'relay']

//   stmt = MySQL.format(stmt, vals)
//   if (pool) pool.query(stmt, function (err, results) {
//     if (err) console.log('!!! Query ERROR !!!', err.message), process.exit(1)

//     console.log('query results='), console.log(results)
//     if (typeof func == 'function') func(results)
//   })
// }

exports.static = function (stcID, func) {
  var stmt = 'SELECT coordinates FROM `device` d \
    JOIN `type` t ON d.?? = t.?? AND LOWER(t.??) = ? AND d.?? = ? \
    WHERE d.`coordinates` != "" OR d.`coordinates` IS NOT NULL '
  var vals = ['typeid', 'id', 'title', 'relay', 'chipid', stcID]

  stmt = MySQL.format(stmt, vals)
  if (pool) pool.query(stmt, func)
}

exports.device_name = function (dvc_id, func) {
  var stmt = 'SELECT d.??, d.?? AS ??, d.??, st.?? AS ??, CONCAT(st.??, " ", st.??) AS ??, st.?? AS ??, st.?? FROM `device` d \
    JOIN staff_device stfd ON d.`id` = stfd.`deviceid` AND ?? = ?\
    JOIN staff st ON st.`id` = stfd.`staffid`'
  var vals = ['id', 'chipid', 'mobile', 'name', 
    'id', 'staff_id', 'firstname', 'lastname', 'staff_name', 'position', 'scope', 'company',
    'chipid', dvc_id]

  stmt = MySQL.format(stmt, vals)
  if (pool) pool.query(stmt, func)
} 