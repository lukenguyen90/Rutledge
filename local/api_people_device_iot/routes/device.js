var router = require('express').Router();
var devicePersistent = require('../models/device.js');
var Utilities = require('../utilities.js');
var uuid = require('node-uuid');

module.exports = deviceAPI;

function deviceAPI(app) {
    var dbconnection = app.get('dbpool');

    router.post('/createInfoDevice', function(req, res) {
        var id = uuid.v1();
        var chipid = req.body.chipid;
        var name = req.body.name;
        var description = req.body.description;
        var imageDevice = req.body.imageDevice;
        var type = req.body.type;
        var ipv6 = req.body.ipv6;
        var datecreated = req.body.datecreated;
        var status = req.body.status;
        var coordinates = req.body.coordinates;
        var expireddates = req.body.expireddates;
        devicePersistent.createDevice(id, chipid, name, description, imageDevice, type, ipv6,
            datecreated, status, coordinates, expireddates, dbconnection,
            function(err, data) {
                res.jsonp(Utilities.apiMessage(err, data))
            });
    });

    router.post('/updateDevice', function(req, res) {
        var id = req.body.id;
        var chipid = req.body.chipid;
        var name = req.body.name;
        var description = req.body.description;
        var imageDevice = req.body.imageDevice;
        var type = req.body.type;
        var ipv6 = req.body.ipv6;
        var datemodified = req.body.datemodified;
        var status = req.body.status;
        var coordinates = req.body.coordinates;
        var expireddates = req.body.expireddates;
        devicePersistent.updateDevice(id, chipid, name, description, imageDevice, ipv6, datemodified, status, type, coordinates, expireddates, dbconnection, function(err, data) {
            res.jsonp(Utilities.apiMessage(err, data));
        });
    });

    router.post('/deleteDevice', function(req, res) {
        var id = req.body.deviceid;
        devicePersistent.deleteDevice(id, dbconnection, function(err, data) {
            res.jsonp(Utilities.apiMessage(err, data));
        });
    })

    router.get('/getAllTypeDevice', function(req, res) {
        devicePersistent.getAllTypeDevice(dbconnection, function(err, data) {
            res.jsonp(Utilities.apiMessage(err, data));
        });
    });

    router.post('/createTypeDevice', function(req, res) {
        var id = uuid.v1();
        var name = req.body.name;
        var title = req.body.title;
        var description = req.body.description;
        var datecreated = req.body.datecreated;
        devicePersistent.createTypeDevice(id, name, title, description, datecreated, dbconnection, function(err, data) {
            res.jsonp(Utilities.apiMessage(err, data));
        });
    })

    router.get('/getTypeDeviceById/:typeid', function(req, res) {
        var id = req.params.typeid;
        devicePersistent.getTypeDeviceById(id, dbconnection, function(err, data) {
            res.jsonp(Utilities.apiMessage(err, data));
        });
    });

    router.post('/updateTypeDevice/:typeid', function(req, res) {
        var id = req.params.typeid;
        var name = req.body.name;
        var title = req.body.title;
        var description = req.body.description;
        var datemodified = req.body.datemodified;
        devicePersistent.updateTypeDevice(id, name, title, description, datemodified, dbconnection, function(err, data) {
            res.jsonp(Utilities.apiMessage(err, data));
        });
    });

    router.post('/deleteTypeDevice', function(req, res) {
        var typeid = req.body.typeid;
        devicePersistent.deleteTypeDevice(typeid, dbconnection, function(err, data) {
            res.jsonp(Utilities.apiMessage(err, data));
        });
    })

    router.get('/getAllDevice', function(req, res) {
        devicePersistent.getAllDevice(dbconnection, function(err, data) {
            res.jsonp(Utilities.apiMessage(err, data));
        });
    });

    router.get('/getDeviceByType/:typeid', function(req, res) {
        var typeid = req.params.typeid;
        devicePersistent.getDeviceByType(typeid, dbconnection, function(err, data) {
            res.jsonp(Utilities.apiMessage(err, data));
        });
    })

    router.get('/getAllStatusDevice', function(req, res) {
        devicePersistent.getAllStatusDevice(dbconnection, function(err, data) {
            res.jsonp(Utilities.apiMessage(err, data));
        })
    })

    router.get('/getDeviceById/:deviceid', function(req, res) {
        var deviceid = req.params.deviceid;
        devicePersistent.getDeviceById(deviceid, dbconnection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        });
    })

    router.get('/getDeviceByTypeId/:typeId/:zoneId', function(req, res) {
        var zoneId = req.params.zoneId;
        var typeId = req.params.typeId;
        devicePersistent.getDeviceByTypeId(typeId, zoneId, dbconnection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        });
    })

    router.get('/getTypeDeviceByZoneId/:zoneId', function(req, res) {
        var zoneId = req.params.zoneId;
        devicePersistent.getTypeDeviceByZoneId(zoneId, dbconnection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        });
    })

    router.get('/getDeployDeviceByZoneId/:zoneId', function(req, res) {
        var zoneId = req.params.zoneId;
        devicePersistent.getDeployDeviceByZoneId(zoneId, dbconnection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        });
    })

    return router
}
