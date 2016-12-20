var mysql = require('mysql');

exports.getAllRoomWithZone = function(connection, done) {
    var query = "SELECT room.*,zone.name as zonename,location.name  as locationname FROM ?? \
    left join ?? on zone.id = room.zoneid \
    left join ?? on location.id = zone.locationid";
    var table = ["room", "zone", "location"];
    query = mysql.format(query, table);
    connection.query(query, done);
}

exports.getRoomWithZoneById = function(roomid, connection, done) {
    var query = "SELECT room.*,zone.name as zonename,location.name as locationname FROM ?? \
    left join ?? on zone.id = room.zoneid \
    left join ?? on location.id = zone.locationid where room.id =?";
    var table = ["room", "zone", "location", roomid];
    query = mysql.format(query, table);
    connection.query(query, done);
}

exports.addRoom = function(roomid, locationid, zoneid, name, coordinatex, coordinatey, description, imageroom, active, datecreated, connection, done) {
    var query = "INSERT INTO room(id,locationid,zoneid,name,coordinatex,coordinatey,description,imageroom,active,datecreated) value(?,?,?,?,?,?,?,?,?,?)";
    var table = [roomid, locationid, zoneid, name, coordinatex, coordinatey, description, imageroom, active, datecreated];
    query = mysql.format(query, table);
    connection.query(query, done);
}

exports.updateRoom = function(roomid, locationid, zoneid, name, coordinatex, coordinatey, description, imageroom, active, datemodified, connection, done) {
    var query = "UPDATE `room` SET ??=?,??=?,??=?,??=?, ?? = ?,?? = ?,?? = ?,??=?,??=? where id = ?";
    var table = ["zoneid", zoneid, "locationid", locationid, "name", name, "coordinatex", coordinatex, "coordinatey", coordinatey,
        "description", description, "imageroom", imageroom, "active", active, 'datemodified', datemodified, roomid
    ];
    query = mysql.format(query, table);
    connection.query(query, done);
};


exports.getRoomsByZoneId = function(zoneid,connection,done){
    var query = "SELECT * FROM room where room.zoneid = ?";
    var table =[zoneid]
    query = mysql.format(query,table);
    connection.query(query, done);
}