const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const rssParser = require('rss-parser');
const parser = new rssParser();
const createError = require('http-errors');

router.post('/', function (req, res, next) {
    const url = req.body.url;

    MongoClient.connect('mongodb://localhost:27017/rss2db')
        .then(client => {
            const dbo = client.db("user_data");
            let posts = [];

            parser.parseURL(url)
                .then(feed => {
                    posts = feed.items.map(post => (
                      {title: post.title, snippet: post.contentSnippet, text: post.content}
                    ));
                    return dbo.collection('posts').deleteMany({});
                })
                .then(() =>  dbo.collection('posts').insertMany(posts))
                .then(() => res.redirect('/'))
                .catch(err => res.redirect('/?error=feed'));
        })
        .catch(() => next(createError(500)));
});

module.exports = router;