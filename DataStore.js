
var crypto = require('crypto');

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
                console.log('HASH not found in mongo');

                // Insert into tracker hits
                trackerHits.insert([
                    {
                        hash: hash,
                        word: word,
                        type: data.type,
                        from: data.from,
                        contents: data.title
                    }
                ], function(err, result) {
                    if (err) console.log('err when inserting');
                    console.log('Insert done');
                });

                // Increment count in keywords
                var keywords = self.db.collection('keywords');
                keywords.update(
                    { word: word },
                    {
                        $inc: { count: 1 }
                    },
                    function(err, result) {
                        console.log('increment count for word done');
                    });
            }
        });
    }
};

module.exports = DataStore;