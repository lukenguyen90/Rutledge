var mysql = require('mysql');

exports.getLocation = function(connection, done) {
    var query = "SELECT id, name FROM ?? ";
    var table = ["location"];
    query = mysql.format(query, table);
    connection.query(query, done);
}
exports.getZoneImage = function(zoneId, connection, done) {
    var query = "SELECT zoneimage FROM ?? where id = ?";
    var table = ["zone", zoneId];
    query = mysql.format(query, table);
    connection.query(query, done);
}
exports.getDeviceDeployment = function(zoneId, connection, done) {
    var query = "SELECT deviceid, type, coordinates, coordinatex, coordinatey, isdeploy FROM ?? where zoneid = ?";
    var table = ["device_deployment", zoneId];
    query = mysql.format(query, table);
    connection.query(query, done);
}
exports.updateCoordinates = function(deviceid, coordinates, top, left, connection, done) {
    var query = "UPDATE ?? SET ??=?, ??=?, ??=? where device_deployment.deviceid = ?";
    var table = ["device_deployment", "coordinates", coordinates, "coordinatex", top, "coordinatey", left, deviceid];
    query = mysql.format(query, table);
    connection.query(query, done);
}

exports.deploy = function(zoneId,device, connection, done) {
    console.log(device)
    var query = "UPDATE ?? SET ??=?,??=?,??=? where device.id = ?";
    var table = ["device", "isdeploy", device.isDeploy, "coordinates", device.col+','+device.row, "zoneid",zoneId, device.deviceid];
    query = mysql.format(query, table);
    connection.query(query, done);
}
