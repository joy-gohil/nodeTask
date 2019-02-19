const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Note = require('../models/notes');

let responseErrorHandler = (code, msg, hint) => {
  console.log(hint);
  let error = new Error(msg);
  error.status = code;
  return error;
};

router.get('/logout', (request, response, next) => {
  request.session.destroy((error) => {
    if(error) next(responseErrorHandler(500,"Internal Server Error: Please try again!", 'session variable error'));
    response.end();
  });
});

router.get('/home', (request, response, next) => {
  let userid = request.session.userid;
  User.findOne({_id: userid}).populate('notes').exec((error, user) => {
    if(error) {
      next(responseErrorHandler(500, "Internal Server Error: Please try again!", 'session variable error'));
    } else{
      //console.log(user);
      response.send(user);
    }
  });
});

router.post('/register', (request, response, next) => {
  console.log(request.body);
  if(request.body){
    let name = request.body.name,
        email = request.body.email,
        password = request.body.password;
    if(name || email || password){
      let user = new User();
      user.name = name;
      user.email = email;
      user.password = password;
      user.save((error, user) => {
        if(error){
          //user exist
        }else{
          console.log(user);
          //user registered
          response.redirect('/login');
        }
      });
    }
  }
});

router.post('/login', (request, response, next) => {
  if(request.body.email && request.body.password){
    User.authenticate(request.body.email, request.body.password, (error, user) => {
      if(error || !user){
        // failed logging in
        let error = new Error('Wrong Email or Password');
        error.status(401);
        return next(error);
      }else{
        // logged in : access the user object via user
        request.session.userid = user._id;
        response.redirect('/home');
      }
    });
  }else{
    let error = new Error('All fields required.');
    error.status = 400;
    return next(error);
  }
});

router.post('/addnote', (request, response, next) => {
  let userid = request.session.userid;
  if(request.body){
    let text = request.body.text;
    if(text){
      let note = new Note();
      note.text = text;
      note.lastUpdated = new Date();
      note.save((error, note) => {
        if(error){
          next(responseErrorHandler(500, "Internal Server Error: Please try again!", 'cannot add note'));
        }else{
          if(User.addNote(userid, note)){
            next(responseErrorHandler(500, "Internal Server Error: Please try again!", 'cannot add note'));
          }
          response.end();
        }
      });
    }
  }
});

router.put('/updatenote', (request, response, next) => {
  if(request.body){
    let noteid = request.body.noteid;
    let notetext = request.body.text;
    if(noteid && notetext){
      Note.findByIdAndUpdate(noteid, {text: notetext}, {new: true}, (error, note) => {
        if(error){
          next(responseErrorHandler(500, "Internal Server Error: Please try again!", 'request body not found'));
        }else{
          response.end();
        }
      });
    }
  }
});

module.exports = router;
// Template
// router.post('', (request, response, next) => {
//
// });
