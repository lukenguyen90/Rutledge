exports.apiMessage = function(err, data) {
    var message = {
        "Error": !!err,
        "Message": err ? "Error executing query" : "Success"
    };
    if (!err && data) message.data = data;
    return message
}
