
var request = require('request'),
    FeedParser = require('feedparser'),
    _ = require('lodash'),
    RSSSource = require('./RSSSource.js'),
    DataStore = require('./DataStore.js'),
    config = require('./config.js');
var TwitterSource = require('./TwitterSource');
var TwitterUserTimelineSource = require('./TwitterUserTimelineSource.js');

var TrackingService = function() {
    var self = this;
    this.sources = [];

    _.each(config.sources.twitterTimelines, function(screenName) {
        self.sources.push(new TwitterUserTimelineSource({screenName: screenName}));
    });
    _.each(config.sources.rssFeeds, function(feedUrl) {
        self.sources.push(new RSSSource({feed: feedUrl, keywords: config.keywords }));
    });

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
    //var twitterUserSource = new TwitterUserTimelineSource({screenName: 'allkpop'});
    setInterval(function() {
        _.each(this.sources, function(source) {
            source.parse();
        });
        twitterSource.parse();
        console.log('\n\n[BEGIN PARSING]\n\n');
        DataStore.total = 0;
        // vergeSource.parse();
        // rssSource.parse();
        //twitterSource.parse();
        //twitterUserSource.parse();
        DataStore.lastTotal = DataStore.total;
    }, 1000*60);
};

module.exports = TrackingService;