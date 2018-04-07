const express = require('express');
const router = express.Router();
const Hogan = require('hjs');
const { MongoClient } = require('mongodb');

/* GET home page. */
router.get('/', function(req, res) {
    if (req.query.error === 'feed') {
        res.render('index', { name: 'RSS2DB Reader', posts: [{title: 'Feed error'}] });
        return;
    }

    MongoClient.connect('mongodb://localhost:27017/rss2db')
        .then(client => {
            const dbo = client.db("user_data");
            dbo.collection('posts').find().limit(12).toArray()
                .then(posts => req.app.locals.posts = posts)
                .then(() => res.render('index', { name: 'RSS2DB Reader', posts: req.app.locals.posts || [{title: 'Feed is empty'}] }))
                .catch(() => res.render('index', { name: 'RSS2DB Reader', posts: [{title: 'DB error'}] }));
        })
        .catch(err => console.log(err));

});

module.exports = router;
