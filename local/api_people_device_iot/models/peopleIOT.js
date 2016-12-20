var mysql = require('mysql');

exports.keepTrackMobile = function(mobileid, position, datetime, connetion, done) {
    var query = "INSERT INTO user(mobileid, position, datetime) VALUE(?,?,?)";
    var table = [mobileid, position, datetime];
    query = mysql.format(query, table);
    connetion.query(query, done);
}




