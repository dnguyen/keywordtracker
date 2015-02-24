var express = require('express'),
    request = require('request');
var TrackingService = require('./TrackingService.js');
var DataStore = require('./DataStore.js');

var MongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:27017/keyword_tracker';

MongoClient.connect(mongoUrl, function(err, db) {
    if (!err) {
        console.log('Connected to mongo server');
        DataStore.db = db;
        var trackingService = new TrackingService();
        trackingService.start();

        var app = express();

        app.get('/', function(req, res) {
            return res.json({
                relevance: DataStore.keywordRelevance,
                total: DataStore.total
            });
        });

        var server = app.listen(3000, function() {
            var host = server.address().address;
            var port = server.address().port;

            console.log('App listening at http://%s:%s', host, port);
        });

    }

});