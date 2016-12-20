var router = require('express').Router();
var notificationPersistent = require('../models/notification.js');
var Utilities = require('../utilities.js');
var uuid = require('node-uuid');
module.exports = notificationAPI;

function notificationAPI(app) {
    var dbconnection = app.get('dbpool');
    router.get('/getAllNotification', function(req, res) {
        notificationPersistent.getAllNotification(dbconnection, function(err, data) {
            res.jsonp(Utilities.apiMessage(err, data));
        });
    })

    router.get('/getNotificationById/:notificationId', function(req, res) {
        var notificationId = req.params.notificationId;
        notificationPersistent.getNotificationById(notificationId, dbconnection, function(err, data) {
            res.jsonp(Utilities.apiMessage(err, data));
        });
    })

    router.post('/new', function(req, res) {
        var notification = req.body;
        notification.id = uuid.v1();
        notificationPersistent.new(notification, dbconnection, function(err, data) {
            res.jsonp(Utilities.apiMessage(err, data));
        })
    })

    router.post('/update/:notificationId', function(req, res) {
        var notificationId = req.params.notificationId;
        var notification = req.body;
        notificationPersistent.update(notificationId, notification, dbconnection, function(err, data) {
            res.jsonp(Utilities.apiMessage(err, data));
        })
    })
    return router
}
