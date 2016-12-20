var router = require('express').Router();
var staffPersistent = require('../models/staff.js');
var userPersistent = require('../models/user.js');
var Utilities = require('../utilities.js');
var async = require('async');
var uuid = require('node-uuid');
module.exports = staffAPI;

function staffAPI(app) {
    var dbconnection = app.get('dbpool');

    router.post('/addStaff', function(req, res) {
        var staffId = uuid.v1();
        var userId = uuid.v1();
        var datecreated = req.body.datecreated;
        var avatar = req.body.avatar;
        var title = req.body.title;
        var email = req.body.email;
        var phonenumber = req.body.phonenumber;
        var gender = req.body.gender;
        var firstname = req.body.firstname;
        var lastname = req.body.lastname;

        var experience = req.body.experience;
        var position = req.body.position;
        var department = req.body.department;
        var company = req.body.company;

        var bloodtype = req.body.bloodtype;
        var diet = req.body.diet;
        var adicted = req.body.adicted;
        var drug = req.body.drug;
        var metalemotionhealth = req.body.metalemotionhealth;
        var training = req.body.training;
        var username = req.body.username;
        var password = req.body.password;
        var fullname = firstname + ' ' + lastname;
        var status = 1;

        staffPersistent.addStaff(staffId, avatar, title, firstname, lastname, email,
            phonenumber, gender, experience, position, department, bloodtype, diet, adicted, drug, metalemotionhealth, datecreated, training, company, dbconnection,
            function(err, data) {
                // res.jsonp(Utilities.apiMessage(err, data));
            });
        userPersistent.signup(userId, staffId, username, password, fullname, email, status, datecreated, dbconnection,
            function(err, data) {
                res.jsonp(Utilities.apiMessage(err, data));
            });

    });

    router.get('/getAllStaff/:pagenumber/:itemsPerPage', function(req, res) {
        var itemsPerPage = req.params.itemsPerPage;
        var pagenumber = req.params.pagenumber;
        var offset = (pagenumber - 1) * itemsPerPage;
        async.series({
            total: function(callback) {
                staffPersistent.countStaff(dbconnection, function(err, results) {
                    var totalStaff = results[0].total;
                    var totalPage = 0;
                    totalPage = Math.floor(totalStaff / itemsPerPage) + (totalStaff % itemsPerPage != 0 ? 1 : 0);
                    callback(null, { "totalStaff": totalStaff, "totalPage": totalPage });
                });
            },
            getStaff: function(callback) {
                staffPersistent.getAllStaff(offset, itemsPerPage, dbconnection, function(err, data) {
                    callback(null, data);
                })
            }
        }, function(err, results) {
            res.jsonp({ "Error": false, "Message": "Success", "statistic": results.total, "data": results.getStaff });
        })
    });

    router.get('/getStaffLimit/:itemsPerPage', function(req, res) {
        var itemsPerPage = req.params.itemsPerPage;
        staffPersistent.getStaffLimit(itemsPerPage, dbconnection, function(err, data) {
            res.jsonp(Utilities.apiMessage(err, data));
        })
    });

    router.get('/getAllStaffNoneLimit', function(req, res) {
        staffPersistent.getAllStaffNoneLimit(dbconnection, function(err, data) {
            res.jsonp(Utilities.apiMessage(err, data));
        });
    })

    router.get('/countStaff', function(req, res) {
        staffPersistent.countStaff(dbconnection, function(err, data) {
            res.jsonp(Utilities.apiMessage(err, data));
        });
    });

    router.get('/getStaffById/:staffId', function(req, res) {
        var staffId = req.params.staffId;
        staffPersistent.getStaffById(staffId, dbconnection, function(err, data) {
            res.jsonp(Utilities.apiMessage(err, data));
        });
    });

    router.post('/updateStaff/:staffId', function(req, res) {
        var staffId = req.params.staffId;
        var datemodified = req.body.datemodified;
        if (req.body.type === 'basic') {
            var avatar = req.body.avatar;
            var title = req.body.title;
            var email = req.body.email;
            var phonenumber = req.body.phonenumber;
            var gender = req.body.gender;
            var firstname = req.body.firstname;
            var lastname = req.body.lastname;
            staffPersistent.updateStaffBasicInfo(staffId, avatar, title, firstname, lastname, email, phonenumber, gender, datemodified, dbconnection,
                function(err, data) {
                    res.jsonp(Utilities.apiMessage(err, data));
                });
        }
        if (req.body.type === 'working') {
            var experience = req.body.experience;
            var position = req.body.position;
            var department = req.body.department;
            var company = req.body.company;
            staffPersistent.updateStaffWorkingInfo(staffId, experience, position, department, datemodified, company, dbconnection,
                function(err, data) {
                    res.jsonp(Utilities.apiMessage(err, data));
                });
        }
        if (req.body.type === 'health') {
            var bloodtype = req.body.bloodtype;
            var diet = req.body.diet;
            var adicted = req.body.adicted;
            var drug = req.body.drug;
            var metalemotionhealth = req.body.metalemotionhealth;
            staffPersistent.updateStaffHealthInfo(staffId, bloodtype, diet, adicted, drug, metalemotionhealth, datemodified, dbconnection,
                function(err, data) {
                    res.jsonp(Utilities.apiMessage(err, data));
                });
        }
        if (req.body.type === 'training') {
            var training = req.body.training;
            staffPersistent.updateStaffTrainingInfo(staffId, training, datemodified, dbconnection,
                function(err, data) {
                    res.jsonp(Utilities.apiMessage(err, data));
                });
        }
    });

    router.get('/checkUsernameExists/:username', function(req, res) {
        var username = req.params.username;
        staffPersistent.checkUsernameExists(username, dbconnection, function(err, data) {
            res.jsonp(Utilities.apiMessage(err, data));
        });
    })


    router.get('/getDeployStaff', function(req, res) {     
        staffPersistent.getDeployStaff(dbconnection, function(err, data) {
            res.jsonp(Utilities.apiMessage(err, data));
        });
    })


    return router
}
