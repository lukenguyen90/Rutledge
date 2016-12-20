var router = require('express').Router();
var deviceIOTPersistent = require('../models/deviceIOT.js');
var permissionPersistent = require('../models/permission.js');
var Utilities = require('../utilities.js');

module.exports = deviceIOTAPI;

function deviceIOTAPI(app) {
    var dbconnection = app.get('dbpool');

    router.get("/deviceMap", function(req, res) {
        deviceIOTPersistent.deviceMap(dbconnection, function(err, rows) {
            res.jsonp(Utilities.apiMessage(err, data));
        });
    });

    return router
}
