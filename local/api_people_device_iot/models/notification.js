var mysql = require('mysql');

exports.getAllNotification = function(connection, done) {
    var query = "select * from notification"
    query = mysql.format(query);
    connection.query(query, done);
}

exports.getNotificationById = function(notificationId, connection, done) {
    var query = "select * from notification where id = ?"
    var table = [notificationId];
    query = mysql.format(query, table);
    connection.query(query, done);
}

exports.new = function(data, connection, done) {
    console.log(data);
    var query = "INSERT INTO notification (id,title,message,level,datecreated) VALUES(?,?,?,?,?)";
    var table = [data.id, data.title, data.message, data.level, data.datecreated];
    query = mysql.format(query, table);
    console.log(query);
    connection.query(query, done);
}

exports.update = function(notificationId, data, connection, done) {
    var query = "UPDATE ?? SET ??=?,??=?,??=?,??=? where id = ?;";
    var table = ["notification", "title", data.title, "message", data.message, "level", data.level, 'datemodified', data.datemodified, notificationId];
    query = mysql.format(query, table);
    connection.query(query, done);
}
