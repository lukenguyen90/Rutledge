var mysql = require('mysql');

exports.getAllZone = function(connection, done) {
    var query = "SELECT * FROM ??";
    var table = ["zone"];
    query = mysql.format(query, table);
    connection.query(query, done);
}

exports.getAllZoneWithLocation = function(connection, done) {
    var query = "SELECT zone.*,location.name as locationname FROM ?? left join ?? on location.id = zone.locationid ";
    var table = ["zone", "location"];
    query = mysql.format(query, table);
    connection.query(query, done);
}

exports.getZoneWithLocationById = function(zoneid, connection, done) {
    var query = "SELECT zone.*,location.name as locationname FROM ?? left join ?? on location.id = zone.locationid where zone.id = ?";
    var table = ["zone", "location", zoneid];
    query = mysql.format(query, table);
    connection.query(query, done);
}

exports.getZoneById = function(zoneid, connection, done) {
    var query = "SELECT zone.* FROM ?? where zone.id = ?";
    var table = ["zone", zoneid];
    query = mysql.format(query, table);
    connection.query(query, done);
}

exports.getZoneInfo = function(connection, done) {
    var query = "SELECT `zone`.* FROM `zone` where `zone`.active = 1 ";
    connection.query(query, done);
}

exports.addZone = function(zoneid, locationid, name, description, width, height, zoneimage, active, datecreated, connection, done) {
    var query = "INSERT INTO zone(id,locationid,name,description,width,height,zoneimage,active,datecreated) value(?,?,?,?,?,?,?,?,?)";
    var table = [zoneid, locationid, name, description, width, height, zoneimage, active, datecreated];
    query = mysql.format(query, table);
    connection.query(query, done);
}

exports.updateZone = function(zoneid, locationid, name, description, zoneimage, active, datemodified, connection, done) {
    var query = "UPDATE `zone` SET ??=?,??=?, ?? = ?,?? = ?,?? = ?,?? = ? where id = ?";
    var table = ["locationid", locationid, "name", name, "description", description, "zoneimage", zoneimage, "active", active, 'datemodified', datemodified, zoneid];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.getZoneByLocation = function(locationId, connection, done) {    
    var query = "SELECT * FROM ?? where locationid=? AND active =1";
    var table = ["zone", locationId];
    query = mysql.format(query, table);
    connection.query(query, done);
}
exports.getZoneWithStaffByLocationId = function(locationid, connection, done) {
    var query = "SELECT  ifnull(sum(staffinroom.status),0) as staffnumber,zone.id,zone.name,zone.zoneimage FROM zone\
    left join staffinroom on staffinroom.zoneid = zone.id\
    where zone.locationid = ?\
    group by zone.id";
    var table = [locationid];
    query = mysql.format(query, table);
    connection.query(query, done);
};
