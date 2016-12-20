var router = require('express').Router();
var userPersistent = require('../models/user.js');
var permissionPersistent = require('../models/permission.js');
var Utilities = require('../utilities.js');
var uuid = require('node-uuid');
module.exports = userAPI;

function userAPI(app) {
    var dbconnection = app.get('dbpool');

    router.put('/login', function(req, res) {
        var user = req.body;

        permissionPersistent.login(user, dbconnection, function(err, data) {
            var message = Utilities.apiMessage(err, data);
            if (!err) {
                message.token = app.get('jwt').sign(user, app.get('secret'), { expiresIn: 24 * 3600 })
            }
            res.jsonp(message)
        })
    });

    router.get('/getAllUser', function(req, res) {
        userPersistent.getAllUser(dbconnection, function(err, data) {
            res.jsonp(Utilities.apiMessage(err, data));
        })
    })

    return router
}