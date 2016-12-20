function REST_ROUTER(client_router) {
    var self = this;
    self.handleRoutes(client_router);
}

REST_ROUTER.prototype.handleRoutes = function(client_router) {
    var self = this;

    client_router.get("/", function(req, res) {
        res.sendFile(__dirname + "/index.html");
    });

    client_router.post("/upload", function(req, res) {
    	res.json(req.files);
    })
}
module.exports = REST_ROUTER;
