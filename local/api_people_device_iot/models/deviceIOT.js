var mysql = require('mysql');

exports.deviceMap = function(connection, done) {
    var query = "SELECT devicemap FROM ?? ";
    var table = ["devicemap"];
    query = mysql.format(query, table);
    connection.query(query, done);
}


