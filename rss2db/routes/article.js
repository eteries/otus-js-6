const express = require('express');
const router = express.Router();
const Hogan = require('hjs');
const { MongoClient, ObjectID } = require('mongodb');
const createError = require('http-errors');

/* GET article by id */
router.get('/:id', function(req, res, next) {
    MongoClient.connect('mongodb://localhost:27017/rss2db')
        .then(client => {
            const dbo = client.db("user_data");
            dbo.collection('posts').findOne({'_id': ObjectID(req.params.id)})
                .then(result => res.render('article', { site: 'RSS2DB', title: result.title, text: result.text }))
                .catch(err => {
                    next(createError(404));
                });
        })
        .catch(() => next(createError(500)));
});

module.exports = router;