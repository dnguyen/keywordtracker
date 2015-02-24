
var request = require('request'),
    FeedParser = require('feedparser'),
    _ = require('lodash'),
    RSSSource = require('./RSSSource.js'),
    DataStore = require('./DataStore.js');

var feedparser = new FeedParser();
var keywords = ['Google', 'Silicon Valley', 'Plex'];
var sources = [];

var TrackingService = function() {

};

TrackingService.prototype.start = function() {
    console.log('Starting Tracking Service');
    var rssSource = new RSSSource({
        feed: 'http://feeds.feedburner.com/TechCrunch/',
        keywords: keywords
    });
    rssSource.parse();
};

module.exports = TrackingService;