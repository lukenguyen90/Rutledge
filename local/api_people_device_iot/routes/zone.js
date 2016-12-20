var router = require('express').Router();
var zonePersistent = require('../models/zone.js');
var Utilities = require('../utilities.js');
var uuid = require('node-uuid');

module.exports = zoneAPI;

function zoneAPI(app) {
    var dbconnection = app.get('dbpool');
    router.post('/addZone', function(req, res) {
        var zoneid = uuid.v1();
        var name = req.body.name;
        var locationid = req.body.locationid;
        var description = req.body.description;
        var zoneimage = req.body.zoneimage;
        var width = req.body.width;
        var height = req.body.height;
        var active = req.body.status;
        var datecreated = req.body.datecreated;
        zonePersistent.addZone(zoneid, locationid, name, description, width, height, zoneimage, active, datecreated, dbconnection, function(err, data) {
            res.jsonp(Utilities.apiMessage(err, data));
        })
    })

    router.get('/getAllZoneWithLocation', function(req, res) {
        zonePersistent.getAllZoneWithLocation(dbconnection, function(err, data) {
            res.jsonp(Utilities.apiMessage(err, data));
        });
    })

    router.get('/getZoneById/:zoneId', function(req, res) {
        var zoneId = req.params.zoneId;
        zonePersistent.getZoneById(zoneId, dbconnection, function(err, data) {
            res.jsonp(Utilities.apiMessage(err, data));
        });
    })

    router.get('/getZoneInfo', function(req, res) {
        zonePersistent.getZoneInfo(dbconnection, function(err, data) {
            var zone = data[0];
            zone.room_coordinates = JSON.parse(zone.room_coordinates);
            res.jsonp(Utilities.apiMessage(err, zone ));
        });
    })

    router.get('/getZoneByLocation/:locationId', function(req, res) {
        var locationId = req.params.locationId;
        zonePersistent.getZoneByLocation(locationId, dbconnection, function(err, data) {
            res.jsonp(Utilities.apiMessage(err, data));
        });
    })

    router.get('/getZoneWithLocationById/:zoneId', function(req, res) {
        var zoneId = req.params.zoneId;
        zonePersistent.getZoneWithLocationById(zoneId, dbconnection, function(err, data) {
            res.jsonp(Utilities.apiMessage(err, data));
        });
    })

    router.post('/updateZone/:zoneId', function(req, res) {
        var zoneId = req.params.zoneId;
        var locationId = req.body.locationId;
        var name = req.body.name;
        var description = req.body.description;
        var zoneimage = req.body.zoneimage;
        var active = req.body.active;
        var datemodified = req.body.datemodified;
        zonePersistent.updateZone(zoneId, locationId, name, description, zoneimage, active, datemodified, dbconnection, function(err, data) {
            res.jsonp(Utilities.apiMessage(err, data));
        })
    })

    router.get('/getZoneWithStaffByLocationId/:locationId', function(req, res) {
        var locationId = req.params.locationId;
        zonePersistent.getZoneWithStaffByLocationId(locationId, dbconnection, function(err, data) {
            res.jsonp(Utilities.apiMessage(err, data));
        })
    });

    return router
}
