var express = require('express'),
    request = require('request');

var MongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:27017/keyword_tracker';

MongoClient.connect(mongoUrl, function(err, db) {
    if (!err) {
        console.log('Connected to mongo server');
        db.close();
    }

});

var app = express();

app.get('/', function(req, res) {
    res.send('Hello world');
});

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});