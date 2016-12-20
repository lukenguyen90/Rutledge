var mysql = require('mysql');

exports.allRoom = function(connection, done) {
    var query = "SELECT * FROM ??";
    var table = ["room"];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.getAllLocation = function(connection, done) {
    var query = "SELECT * FROM ??";
    var table = ["location"];
    query = mysql.format(query, table);
    connection.query(query, done);
}

exports.getLocationById = function(locationid, connection, done) {
    var query = "SELECT * FROM ?? where id=?";
    var table = ["location", locationid];
    query = mysql.format(query, table);
    connection.query(query, done);
}

exports.addLocation = function(locationid, name, description, imagelocation, active, datecreated, connection, done) {
    var query = "INSERT INTO location(id,name,description,imagelocation,active,datecreated) value(?,?,?,?,?,?)";
    var table = [locationid, name, description, imagelocation, active, datecreated];
    query = mysql.format(query, table);
    connection.query(query, done);
}

exports.updateLocation = function(locationid, name, description, imagelocation, active, datemodified, connection, done) {
    var query = "UPDATE `location` SET ??=?, ?? = ?,?? = ?,?? = ?,??=? where id = ?";
    var table = ["name", name, "description", description, "imagelocation", imagelocation, "active", active, 'datemodified', datemodified, locationid];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.getLocationWithStaffNumber = function(connection, done) {
    var query = "SELECT  ifnull(sum(staffinroom.status),0) as staffnumber,location.id,location.name,location.imagelocation FROM location\
    left join staffinroom on staffinroom.locationid = location.id group by location.id";
    query = mysql.format(query);
    connection.query(query, done);
};

exports.getZoneWithStaffByLocationId = function(locationid, connection, done) {
    var query = "SELECT  ifnull(sum(staffinroom.status),0) as staffnumber,zone.id,zone.name,zone.zoneimage FROM zone\
    left join staffinroom on staffinroom.zoneid = zone.id\
    where zone.locationid = ?\
    group by zone.id";
    var table = [locationid];
    query = mysql.format(query, table);
    connection.query(query, done);
};
