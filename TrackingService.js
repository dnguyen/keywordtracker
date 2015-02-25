
var request = require('request'),
    FeedParser = require('feedparser'),
    _ = require('lodash'),
    RSSSource = require('./RSSSource.js'),
    DataStore = require('./DataStore.js');
var TwitterSource = require('./TwitterSource');
var feedparser = new FeedParser();
var keywords = ['Google', 'Silicon Valley', 'Microsoft'];
var sources = [];

var TrackingService = function() {

};

TrackingService.prototype.start = function() {
    console.log('Starting Tracking Service');
    // var rssSource = new RSSSource({
    //     feed: 'http://feeds.feedburner.com/TechCrunch/',
    //     keywords: keywords
    // });
    // rssSource.parse();
    // var vergeSource = new RSSSource({
    //     feed: 'http://www.theverge.com/rss/index.xml',
    //     keywords: keywords
    // });
    // vergeSource.parse();
    var twitterSource = new TwitterSource();
    twitterSource.parse();
};

module.exports = TrackingService;