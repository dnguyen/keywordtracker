
var Twit = require('twit'),
    _ = require('lodash'),
    config = require('./config.js'),
    DataStore = require('./DataStore.js');

var TwitterSource = function(options) {
    this.twit = new Twit({
        consumer_key: config.twitter.consumerKey,
        consumer_secret: config.twitter.consumerSecret,
        access_token: config.twitter.accessToken,
        access_token_secret: config.twitter.accessTokenSecret
    });
};

TwitterSource.prototype.parse = function() {
    var searchQuery = '"' + config.keywords[0] + '"';
    _.each(config.keywords, function(word) {
        searchQuery += ' OR "' + word + '"';
    });
    console.log('Searching search/tweets ' + encodeURI(searchQuery));
    this.twit.get('search/tweets', { q: encodeURI(searchQuery), lang: 'en', count: 25 }, function(err, data, response) {
        _.each(data.statuses, function(tweet) {
            console.log(tweet.text);
            _.each(config.keywords, function(word) {
                if (tweet.text.indexOf(word) > -1 || tweet.text.indexOf(word.toLowerCase()) > -1) {
                    console.log(tweet.text);
                    DataStore.increment(word, 1);
                    DataStore.addHit(word, { from: tweet.id, title: tweet.text, type: 'tweet' });
                }
            });
        });
    });
};

module.exports = TwitterSource;