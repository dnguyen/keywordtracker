var Config = {
    checkTimeInterval: 1000 * 60,
    keywords: [],
    twitter: {
        consumerKey: '',
        consumerSecret: '',
        accessToken: '',
        access_token_secret: ''
    },
    sources: {
        twitterTimelines: [
            // Twitter screen names
        ],
        rssFeeds: [
            // RSS feed URLs
        ],
        subreddits: [
            // Subreddit names
        ]
    }
};

module.exports = Config;