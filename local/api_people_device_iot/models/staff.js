var mysql = require('mysql');

exports.addStaff = function(staffid, avatar, title, firstname, lastname, email,
    phonenumber, gender, experience, position, department, bloodtype, diet, adicted, drug, metalemotionhealth, datecreated, training, company, connection, done) {
    var query = "INSERT INTO staff(id,avatar,title,firstname,lastname,email,phonenumber,gender,experience, position,\
    department,bloodtype, diet, adicted, drug, metalemotionhealth,datecreated,training,company)\
     VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    var table = [staffid, avatar, title, firstname, lastname, email, phonenumber, gender,
        experience, position, department, bloodtype, diet, adicted, drug, metalemotionhealth, datecreated, training, company
    ];
    query = mysql.format(query, table);
    connection.query(query, done);
}


exports.countStaff = function(connection, done) {
    var query = "select  count(id) as total from staff";
    query = mysql.format(query);
    connection.query(query, done);
}

exports.getAllStaff = function(offset, itemsPerPage, connection, done) {
    var query = "select * from staff limit " + offset + "," + itemsPerPage;
    query = mysql.format(query);
    connection.query(query, done);
}

exports.getAllStaffNoneLimit = function(connection, done) {
    var query = "select * from staff";
    query = mysql.format(query);
    connection.query(query, done);
}

exports.getStaffById = function(staffid, connection, done) {
    var query = "SELECT staff.*,user.username FROM `staff` left join user on staff.id = user.staffid WHERE staff.id = ?";
    var table = [staffid];
    query = mysql.format(query, table);
    connection.query(query, done);
}

exports.updateStaffBasicInfo = function(staffid, avatar, title, firstname, lastname, email, phonenumber, gender, datemodified, connection, done) {
    var query = "UPDATE `staff` SET ??=?, ?? = ?,?? = ?,?? = ?,??=?,??=?,??=?,??=? where id = ?";
    var table = ["avatar", avatar, "title", title, "firstname", firstname, "lastname", lastname, "email", email, "phonenumber", phonenumber, "gender", gender, 'datemodified', datemodified, staffid];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.updateStaffWorkingInfo = function(staffid, experience, position, department, datemodified, company, connection, done) {
    var query = "UPDATE `staff` SET ??=?, ?? = ?,??=?,??=?,??=? where id = ?";
    var table = ["experience", experience, "position", position, "department", department, 'datemodified', datemodified, 'company', company, staffid];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.updateStaffHealthInfo = function(staffid, bloodtype, diet, adicted, drug, metalemotionhealth, datemodified, connection, done) {
    var query = "UPDATE `staff` SET ??=?, ?? = ?,??=?,??=?,??=?,??=? where id = ?";
    var table = ["bloodtype", bloodtype, "diet", diet, "adicted", adicted, "drug", drug, "metalemotionhealth", metalemotionhealth, 'datemodified', datemodified, staffid];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.updateStaffTrainingInfo = function(staffid, training, datemodified, connection, done) {
    var query = "UPDATE `staff` SET ??=?,??=? where id = ?";
    var table = ["training", training, 'datemodified', datemodified, staffid];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.checkUsernameExists = function(username, connection, done) {
    var query = "SELECT * FROM `user` WHERE username = ?";
    var table = [username];
    query = mysql.format(query, table);
    connection.query(query, done);
}

exports.getStaffLimit = function(itemsPerPage,connection, done) {
    var query = "select * from staff limit "+itemsPerPage;
    query = mysql.format(query);
    connection.query(query, done);
}

exports.getDeployStaff = function(connection, done) {
    var query = "SELECT device.chipid, staff.firstname, staff.lastname FROM ??\
           left join ?? on staff_device.deviceid=device.id\
           left join ?? on staff_device.staffid = staff.id\
           where device.active = 1 AND device.isdeploy = 1";
    var table = ["staff_device", "device", "staff"];
    query = mysql.format(query, table);
    connection.query(query, done);
}