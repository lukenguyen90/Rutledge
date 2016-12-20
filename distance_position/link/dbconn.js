if (!module.parent) throw "Nothing special to do!"

var MySQL = require('mysql')
var DBLog = console.log.bind({}, '###')
var DBConf = page0.database
var DBPool = {
  
  config: function (state) {
    var run_state = state in DBConf ? state: "local"
    this.conf = DBConf[run_state]
    return this
  },

  connect: function (done) {
    if (!this.conf) throw new Error('No configuration!')
    
    done = itis.Function(done)? done: noop
    this.pool = MySQL.createPool(this.conf)
    
    var address = this.conf.host + ':' + this.conf.port
    var info = '@@version'
    
    this.pool.getConnection(function (conn_err, conn) {
      if (conn_err) throw conn_err

      conn.query('SELECT ' + info, function (err, rows) {
        if (err) throw err
        info = "v." + rows[0][info]
        DBLog("DB connected @", address, info)
      })

      conn.release(), done()
    })

    this.pool.on('connection', function (conn) {
      DBLog('DB thread established', '#' + conn.threadId)
    })

    return this
  },

  query: function (stmt, func) {
    if (!this.pool) throw new Error('DB connection is down')

    func = itis.Function(func)? func: noop

    this.pool.query(stmt, 
      function (err, results) {
        if (err) throw err
        else func(results)
      })
  },

  format: MySQL.format, escape: MySQL.escape,

  end: function (func) {
    func = itis.Function(func)? func: noop
    if (this.pool) this.pool.end(func)
  }

}

module.exports = function (init) {
  var opts = itis.Object(init)
  var state = opts? init.state: String(init)
  return Object.create(DBPool).config(state)
}