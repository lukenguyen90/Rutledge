var router = require('express').Router();
var deployzonedevicePersistent = require('../models/deployzonedevice.js');
var Utilities = require('../utilities.js');
var uuid = require('node-uuid');

module.exports = deployzonedeviceAPI;

function deployzonedeviceAPI(app) {
    var dbconnection = app.get('dbpool');
    router.get('/getZoneImage/:zoneId', function(req, res) {
        var zoneId = req.params.zoneId;
        deployzonedevicePersistent.getZoneImage(zoneId, dbconnection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        })
    });

    router.get('/getDeviceDeployment/:zoneId', function(req, res) {
        var zoneId = req.params.zoneId;
        deployzonedevicePersistent.getDeviceDeployment(zoneId, dbconnection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        });
    });

    router.post('/updateCoordinate', function(req, res) {
        var devices = req.body.deviceMap;
        if (typeof devices !== 'undefined') {
            devices.forEach(function(o) {
                var coordinates = o.coordinateY + "," + o.coordinateX;
                var deviceid = o.deviceId;
                var top = o.top;
                var left = o.left;
                deployzonedevicePersistent.updateCoordinates(deviceid, coordinates, top, left, dbconnection);
            })
            res.jsonp({ "Error": false, "Message": "Success" });
        }
    });

    router.post('/deploy', function(req, res) {
        var data = req.body;
        var list_device = req.body.list_device;
        for (var i = 0; i < list_device.length; i++) {
            deployzonedevicePersistent.deploy(data.zoneId, list_device[i], dbconnection, function(err, data) {});
        }
        res.jsonp({ "Error": false, "Message": "Success" });

    })

    return router
}
