var app = require('express')(),
    request = require('request'),
    IOServer = require('./IOServer.js'),
    TrackingService = require('./TrackingService.js'),
    DataStore = require('./DataStore.js'),
    MongoClient = require('mongodb').MongoClient,
    mongoUrl = 'mongodb://localhost:27017/keyword_tracker';

MongoClient.connect(mongoUrl, function(err, db) {
    if (!err) {
        console.log('Connected to mongo server');
        DataStore.db = db;
        start();
    }
});

function start() {

    var server = require('http').Server(app),
        ioServer = new IOServer({ server: server }),
        trackingService = new TrackingService();

    trackingService.start();

    server.listen(3000, function() {
        var host = server.address().address;
        var port = server.address().port;

        console.log('App listening at http://%s:%s', host, port);
    });

    app.get('/', function(req, res) {
        var keywords = db.collection('keywords');

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
}