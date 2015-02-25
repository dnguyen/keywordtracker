
var Twit = require('twit'),
    _ = require('lodash'),
    moment = require('moment'),
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
    var searchQuery = '';
    for (var i = 0; i < config.keywords.length; i++) {
        searchQuery += '"' + config.keywords[i] + '"';
        if (i < config.keywords.length - 1) {
            searchQuery += ' OR ';
        }
    }
    console.log(searchQuery);
    console.log('Searching search/tweets ' + encodeURI(searchQuery));
    this.twit.get('search/tweets', { q: encodeURI(searchQuery), lang: 'en', count: 100 }, function(err, data, response) {
        if (err) {
            console.log('error with loading tweets');
            console.log(err);
        } else {
            _.each(data.statuses, function(tweet) {
                //console.log(tweet.text + created);
                _.each(config.keywords, function(word) {
                    if (tweet.text.indexOf(word) > -1 || tweet.text.indexOf(word.toLowerCase()) > -1) {
                        var created = moment(tweet.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY', 'en');
                        console.log(tweet.text);
                        DataStore.increment(word, 1);
                        DataStore.addHit(word, {
                            from: tweet.id,
                            title: tweet.text,
                            type: 'tweet',
                            date: created.toDate()
                        });
                    }
                });
            });
        }
    });
};

module.exports = TwitterSource;