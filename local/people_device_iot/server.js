var express 		= require("express");
var app 			= express();
var client 			= require("./client.js");
var config 			= require('./config');
var http 			= require('http').Server(app);
var port 			= config.port;
var bodyParser = require("body-parser");

var io = require('socket.io')(http);
var mqtt = require('mqtt');
var multipart = require('connect-multiparty');
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

// amq connection to cloud server
var cloudbroker = mqtt.connect(config.broker.cloud)
console.log('Connecting to broker on upper cloud...')
cloudbroker.on('connect', function () {
    console.log('Cloud broker connected!')
})

// change to use broker info from config
var server = mqtt.connect(config.broker.local);

server.on('connect', function() {
    server.subscribe('positions');
});

server.on('message', function(topic, message) {
    if ('positions' === topic) {
        message = JSON.parse(message);
        io.emit('data', message);
        
        // then add mapid
        message.mapId = config.mapid
        message = JSON.stringify(message)
        // forward to cloud
        cloudbroker.publish(topic, message)
    }
});

app.post('/sendMessage',function(req,res){
    // res.send('hello');
 // var aa =    JSON.parse(req.body);
    console.log(req.body)
    var message = JSON.stringify(req.body)
    server.publish('textdata', message);
    res.json({status:'ok'});
})


function REST() {
    var self = this;
    self.configureExpress();
};

REST.prototype.configureExpress = function() {
    var self = this;

    app.use(express.static(__dirname));
    app.use(express.static(__dirname + '/assets'));
    app.use(multipart({
        uploadDir: './uploads'
    }));
    var client_router = express.Router();
    app.use("/", client_router);
    
    var client_router_app = new client(client_router);

    self.startServer();
}

REST.prototype.startServer = function() {
    http.listen(port, function() {
        console.log("All right ! I am alive at Port '" + port + "'.");
    });
}


new REST();
