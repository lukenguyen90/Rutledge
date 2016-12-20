
var mysql = require('mysql')

exports.login = function(user, connection, done) {
    var query = "select * from user \
    left join staff on staff.id = user.staffid\
                where user.username = ? and user.password = ?";
    var table = [user.name, user.password];
    query = mysql.format(query, table);
    connection.query(query, done);
};
