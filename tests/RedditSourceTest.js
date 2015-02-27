
var _ = require('lodash'),
    DataStore = require('../DataStore.js'),
    config = require('../config.js'),
    SubRedditSource = require('../SubRedditSource.js');

var subredditSource = new SubRedditSource({ subreddit: 'kpop' });
subredditSource.parse();