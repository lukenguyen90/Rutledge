var mysql = require('mysql');

exports.signup = function(id, staffid, username, password, fullname, email, status, datecreated, connetion, done) {
    var query = "INSERT INTO user(id,staffid,username,password,fullname,name,email,status,datecreated) VALUE(?,?,?,?,?,?,?,?,?)";
    var table = [id, staffid, username, password, fullname, fullname, email, status, datecreated];
    query = mysql.format(query, table);
    connetion.query(query, done);
}

exports.getAllUser = function(connection, done) {
    var query = "SELECT * FROM user";
    query = mysql.format(query);
    connection.query(query, done);
};

exports.getUserById = function(id, connetion, done) {
    var query = "SELECT user.*,staff.avatar FROM user left join staff on staff.id = user.staffid WHERE user.id=?";
    var table = [id];
    query = mysql.format(query, table);
    connetion.query(query, done)
}
