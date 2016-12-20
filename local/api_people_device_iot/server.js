var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var md5 = require('MD5');
var config = require('./config'); // get our config file
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var app = express();
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || config.api_port;
var ipadr = process.env.OPENSHIFT_NODEJS_IP || config.localhost;
var stage = process.env.NODE_ENV || "development";

var pool = mysql.createPool(config["db_conn"][stage]);

app.set('dbpool', pool);
app.set('jwt', jwt);
app.set('secret', config.secret);

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
// app.use(express.static(__dirname + '/customReportDir'));

//cross domain.
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Cache-Control,x-access-token");
    if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        return res.end();
    } else {
        return next();
    }
});


app.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.param.token || req.headers['x-access-token'] || req.query.token;

    if (req.url == '/api/user/login' || req.method == 'GET') {
        next();
        return;
    }

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.secret, function(err, decoded) {

            if (err) {
                return res.status(403).send({
                    success: false,
                    message: 'Failed to authenticate token or token expried.'
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {


        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

addApi({
    url:'user', 
    filename: 'user'
});
addApi({
    url:'device', 
    filename: 'device'
});
addApi({
    url:'staff', 
    filename: 'staff'
});
addApi({
    url:'location', 
    filename: 'location'
});
addApi({
    url:'zone', 
    filename: 'zone'
});
addApi({
    url:'room', 
    filename: 'room'
});
addApi({
    url:'deployzonedevice', 
    filename: 'deployzonedevice'
});
addApi({
    url:'notification', 
    filename: 'notification'
});

var room

app.listen(port, function() {
    console.log("All right ! I am alive at Port '" + port + "'.\nConnecting to database " + config.db_conn.development.host);
});

function addApi(node) {
  var url = '/api/' + node.url;
  var apijs = './routes/' + node.filename;
  // console.log('adding', require(apijs)(app).stack)
  require('./document')(url,require(apijs)(app).stack);
  app.use(url, require(apijs)(app));
}
