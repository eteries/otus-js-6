const createError = require('http-errors');
const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const indexRouter = require('./routes/index');
const articleRouter = require('./routes/article');
const addRouter = require('./routes/add');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));

app.use('/', indexRouter);
app.use('/article', articleRouter);
app.use('/add', addRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

MongoClient.connect('mongodb://localhost:27017/rss2db')
  .then(db => app.listen(3000, () => console.log('RSS2DB app listening on port 3000!')))
  .catch(() => console.error('Connection failed!'));

module.exports = app;


