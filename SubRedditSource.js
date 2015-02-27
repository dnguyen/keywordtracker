
var request = require('request'),
    _ = require('lodash'),
    moment = require('moment'),
    config = require('./config'),
    DataStore = require('./DataStore');

var SubRedditSource = function(options) {
    this.subreddit = options.subreddit;
};

SubRedditSource.prototype.parse = function() {
    var self = this;
    console.log('parsing subreddit');

    request('https://www.reddit.com/r/' + this.subreddit + '/new.json?sort=new', function(err, response, body) {
        if (!err && response.statusCode == 200) {
            var bodyObj = JSON.parse(body);
            _.each(bodyObj.data.children, function(post) {
                var postData = post.data;
                console.log(postData.title)

                _.each(config.keywords, function(word) {

                });
            });
        }
    });

};

module.exports = SubRedditSource;