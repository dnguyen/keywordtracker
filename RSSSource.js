var request = require('request'),
    FeedParser = require('feedparser'),
    _ = require('lodash');

var DataStore = require('./DataStore.js');

var RSSSource = function(options) {
    if (!options.feed) console.log('Invalid feed');
    this.feed = options.feed;
    this.keywords = options.keywords;
    this.feedParser = new FeedParser();
};

RSSSource.prototype.parse = function() {

    var req = request(this.feed),
        self = this,
        relevanceCount = 0;

    // Make request to feed
    req.on('response', function(res) {
        var stream = this;
        if (res.statusCode != 200) console.log('failed to connect.');

        stream.pipe(self.feedParser);
    });

    // Start reading feed
    self.feedParser.on('readable', function() {
        var stream = this,
            meta = this.meta,
            item;

        // Find any posts that contain our keywords
        while (item = stream.read()) {
            _.each(self.keywords, function(word) {
                if (item.title.indexOf(word) > -1 || item.title.toLowerCase().indexOf(word) > -1) {
                    console.log(item.title);
                    DataStore.increment(word, 1);
                    DataStore.addHit(word, { from: item.link, title: item.title });
                }
            });
        }
        //console.log(DataStore.keywordRelevance);
    });
};

// TODO: Implement post parsing
// RSSSource.prototype.parsePost = function(postUrl) {

// };



module.exports = RSSSource;