
var mongoose = require('mongoose'),
    _ = require('lodash');

var models = {
    init: function() {
        var keyword = require('./keyword');
        _.extend(this, keyword);
    }
};

module.exports = models;