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
            var keywords = db.collection('keywords'),
                trackerhits = db.collection('trackerhits');

            keywords.aggregate([{
                $group: {
                    _id: null,
                    total: {
                        $sum: "$count"
                    }
                }
            }], function(err, docs) {
                if (docs.length > 0) {
                    var totalCount = docs[0].total;
                    console.log(totalCount);

                    keywords.find({ $query: { }, $orderby: { count: -1}}, { }, { limit: 6 }).toArray(function(err, docs) {
                        if (!err) {
                            var rtrObject = {
                                keywords: docs,
                                total: totalCount
                            };

                            return res.json(rtrObject);
                        }

                    });
                } else {
                    return res.json({ error: 'no docs' });
                }

            });
        });

        var server = app.listen(3000, function() {
            var host = server.address().address;
            var port = server.address().port;

            console.log('App listening at http://%s:%s', host, port);
        });

    }

});