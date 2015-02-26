
var crypto = require('crypto'),
    $q = require('bluebird');

var DataStore = {
    // Keep track of counts in memory
    keywordRelevance: {},
    lastTotal: 0,
    total: 0,

    increment: function(word, amount) {
        if (!this.keywordRelevance[word]) {
            this.keywordRelevance[word] = { count: 0 };
        }

        this.keywordRelevance[word].count += amount;
        this.total++;

    },

    addHit: function(word, data) {
        var self = this;
        console.log('[ADDING HIT] \n\t' + data.from);
        var hash = crypto.createHash('md5').update(data.from + word).digest('hex');
        console.log('\thash: ' + hash);
        var trackerHits = this.db.collection('trackerhits');

        // Check if link has already been parsed previously, if not
        // Add it to the database
        trackerHits.find({ hash: hash }).toArray(function (err, docs) {
            if (docs.length === 0) {
                self.insertTrackerHit({
                    hash: hash,
                    word: word,
                    type: data.type,
                    from: data.from,
                    contents: data.title,
                    date:  data.date
                }).then(function() {
                    console.log('[INSERT DONE] ' + data.from + ' ' +  data.title);
                });

                self.upsertKeyword(word).then(function() {
                    console.log('[UPSERT DONE] ' + word);
                });

            }
        });
    },

    /**
     * Inserts a tracker hit into the database
     * @param  {object} [Data fields to set]
     * @return {promise}
     */
    insertTrackerHit: function(data) {
        var deferred = $q.defer(),
            trackerHits = this.db.collection('trackerhits');

        trackerHits.insert([
            data
        ], function(err, result) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve();
            }
        });

        return deferred.promise;
    },

    /**
     * Updates keyword count in database.
     * If the keyword doesn't exist yet in the database, insert it.
     * @param  {string} word [Word to update]
     * @return {promise}
     */
    upsertKeyword: function(word) {
        var deferred = $q.defer(),
            keywords = this.db.collection('keywords');

        keywords.update(
            { word: word },
            { $inc: { count: 1 }},
            { upsert: true },
            function(err, result) {
                deferred.resolve();
            }
        );

        return deferred.promise;
    },

    /**
     * Checks if a track hit is already in the database.
     * Calculate a hash using data.from and data.word
     */
    isTracked: function(data, callback) {
        var collection = this.db.collection('trackerhits'),
            hash = crypto.createHash('md5').update(data.from + data.word).digest('hex');

        collection.find({ hash : hash }).toArray(function(err, docs) {
            if (!err) {
                callback((docs.length > 0));
            }
        });
    }
};

module.exports = DataStore;