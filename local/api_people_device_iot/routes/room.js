var router = require('express').Router();
var roomPersistent = require('../models/room.js');
var Utilities = require('../utilities.js');
var uuid = require('node-uuid');

module.exports = roomAPI;

function roomAPI(app) {
    var dbconnection = app.get('dbpool');
    router.get('/getAllRoomWithZone', function(req, res) {
        roomPersistent.getAllRoomWithZone(dbconnection, function(err, data) {
            res.jsonp(Utilities.apiMessage(err, data));
        })
    })

    router.get('/getRoomWithZoneById/:roomId', function(req, res) {
        var roomId = req.params.roomId;
        roomPersistent.getRoomWithZoneById(roomId, dbconnection, function(err, data) {
            res.jsonp(Utilities.apiMessage(err, data));
        })
    });

    router.get('/getRoomsByZoneId/:zoneId', function(req, res) {
        var zoneId = req.params.zoneId;
        roomPersistent.getRoomsByZoneId(zoneId, dbconnection, function(err, data) {
            res.jsonp(Utilities.apiMessage(err, data));
        })
    })

    router.post('/addRoom', function(req, res) {
        var roomid = uuid.v1();
        var name = req.body.name;
        var locationid = req.body.locationid;
        var zoneid = req.body.zoneid;
        var coordinatex = req.body.coordinatex;
        var coordinatey = req.body.coordinatey;
        var description = req.body.description;
        var imageroom = req.body.imageroom;
        var active = req.body.status;
        var datecreated = req.body.datecreated;
        roomPersistent.addRoom(roomid, locationid, zoneid, name, coordinatex, coordinatey, description, imageroom, active,
            datecreated, dbconnection,
            function(err, data) {
                res.jsonp(Utilities.apiMessage(err, data));
            })
    })

    router.post('/updateRoom/:roomId', function(req, res) {
        var roomId = req.params.roomId;
        var locationId = req.body.locationId;
        var zoneId = req.body.zoneId;
        var name = req.body.name;
        var coordinatex = req.body.coordinatex;
        var coordinatey = req.body.coordinatey;
        var description = req.body.description;
        var imageroom = req.body.imageroom;
        var active = req.body.active;
        var datemodified = req.body.datemodified;
        console.log(req.body);
        roomPersistent.updateRoom(roomId, locationId, zoneId, name, coordinatex, coordinatey, description, imageroom, active,
            datemodified, dbconnection,
            function(err, data) {
                res.jsonp(Utilities.apiMessage(err, data));
            })
    })

    return router
}
