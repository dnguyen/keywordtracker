
var request = require('request'),
    FeedParser = require('feedparser'),
    _ = require('lodash'),
    RSSSource = require('./RSSSource.js'),
    DataStore = require('./DataStore.js'),
    config = require('./config.js');
var TwitterSource = require('./TwitterSource');
var TwitterUserTimelineSource = require('./TwitterUserTimelineSource.js');
var SubRedditSource = require('./SubRedditSource.js');

var TrackingService = function() {
    var self = this;
    this.sources = [];

    // _.each(config.sources.twitterTimelines, function(screenName) {
    //     self.sources.push(new TwitterUserTimelineSource({screenName: screenName}));
    // });
    // _.each(config.sources.rssFeeds, function(feedUrl) {
    //     self.sources.push(new RSSSource({feed: feedUrl, keywords: config.keywords }));
    // });
    _.each(config.sources.subreddits, function(subreddit) {

        self.sources.push(new SubRedditSource({subreddit: subreddit}));
    });

};

TrackingService.prototype.start = function() {
    console.log('Starting Tracking Service');

    var twitterSource = new TwitterSource();
    //setInterval(function() {
        console.log('\n\n[BEGIN PARSING]\n\n');
        DataStore.total = 0;

        _.each(this.sources, function(source) {
            source.parse();
        });
        //twitterSource.parse();
    //}, 1000*60);
};

module.exports = TrackingService;