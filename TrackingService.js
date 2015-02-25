
var request = require('request'),
    FeedParser = require('feedparser'),
    _ = require('lodash'),
    RSSSource = require('./RSSSource.js'),
    DataStore = require('./DataStore.js'),
    config = require('./config.js');
var TwitterSource = require('./TwitterSource');

var TrackingService = function() {

};

TrackingService.prototype.start = function() {
    console.log('Starting Tracking Service');
    // var rssSource = new RSSSource({
    //     feed: 'http://feeds.feedburner.com/TechCrunch/',
    //     keywords: keywords
    // });
    // var vergeSource = new RSSSource({
    //     feed: 'http://www.theverge.com/rss/index.xml',
    //     keywords: keywords
    // });
    // var rssSource = new RSSSource({
    //     feed: 'http://feeds.feedburner.com/NetizenBuzz',
    //     keywords: config.keywords
    // });
    var twitterSource = new TwitterSource();
    setInterval(function() {
        console.log('\n\n[BEGIN PARSING]\n\n');
        DataStore.total = 0;
        // vergeSource.parse();
        // rssSource.parse();
        //twitterSource.parse();
        DataStore.lastTotal = DataStore.total;
    }, 1000*60);
};

module.exports = TrackingService;