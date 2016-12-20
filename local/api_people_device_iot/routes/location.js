var router = require('express').Router();
var locationPersistent = require('../models/location.js');
var Utilities = require('../utilities.js');
var uuid = require('node-uuid');
module.exports = locationAPI;

function locationAPI(app) {
    var dbconnection = app.get('dbpool');
    router.get('/getAllLocation', function(req, res) {
        locationPersistent.getAllLocation(dbconnection, function(err, data) {
            res.jsonp(Utilities.apiMessage(err, data));
        });
    })

    router.get('/getLocationById/:locationId', function(req, res) {
        var locationId = req.params.locationId;
        locationPersistent.getLocationById(locationId, dbconnection, function(err, data) {
            res.jsonp(Utilities.apiMessage(err, data));
        });
    })

    router.post('/addLocation', function(req, res) {
        var id = uuid.v1();
        var name = req.body.name;
        var description = req.body.description;
        var imageLocation = req.body.imageLocation;
        var active = req.body.status;
        var datecreated = req.body.datecreated;
        locationPersistent.addLocation(id, name, description, imageLocation, active, datecreated, dbconnection, function(err, data) {
            res.jsonp(Utilities.apiMessage(err, data));
        })
    })

    router.post('/updateLocation/:locationId', function(req, res) {
        var locationId = req.params.locationId;
        var name = req.body.name;
        var description = req.body.description;
        var imageLocation = req.body.imageLocation;
        var active = req.body.active;
        var datemodified = req.body.datemodified;
        locationPersistent.updateLocation(locationId, name, description, imageLocation, active, datemodified, dbconnection, function(err, data) {
            res.jsonp(Utilities.apiMessage(err, data));
        })
    })

    router.get('/getLocationWithStaffNumber', function(req, res) {
        locationPersistent.getLocationWithStaffNumber(dbconnection, function(err, data) {
            res.jsonp(Utilities.apiMessage(err, data));
        })
    });
    return router
}