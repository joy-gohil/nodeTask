const mongoose = require('mongoose');
const express = require('express');
const bodyparser = require('body-parser');
const logger = require('morgan');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const errorhandler = require('errorhandler');
//const = require('');

const app = express();
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/blogdb', {useNewUrlParser: true});

app.use(session({
  secret: 'work hard',
  resave: false,
  saveUninitialized: false
}));

app.use(bodyparser.json());

app.use(logger('dev'));

let routes = require('./routes/router');

app.use((request, response, next) => {
  if(request.url == '/login' || request.url == '/register'){
    next();
  }else{
    if(!request.session.userid){
      let error = new Error('Please Login');
      error.status = 404;
      next(error);
    }
    next();
  }
});

app.use('/', routes);

app.use((error, request, response, next) => {
  response.status(error.status || 500);
  response.send(error.message);
});

app.listen(3333, () => {
  console.log("Blog application listening on port: 3333");
});
