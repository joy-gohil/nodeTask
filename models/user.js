const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
  name: {type: String, unique: true, trim: true, required: true},
  email: {type: String, unique: true, trim: true, required: true},
  password: {type: String, required: true},
  notes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Notes'}]
});

UserSchema.statics.addNote = function (uid, note){
  User.findById(uid, (error, user) => {
    if(error){
      console.log(error);
      return false;
    } else if(!user) {
      return false;
    }else{
      user.notes.push(note._id);
      console.log(user);
      user.save((error, user) => {
        if(error) {
          return false;
        }
        return true;
      });
    }
  });
};

UserSchema.statics.authenticate = function (email, password,  callback) {
  User.findOne({email: email}).exec((error, user) => {
    if(error){
      return callback(error);
    } else if(!user) {
      let error = new Error('User not Found');
      error.status = 401;
      return callback(error);
    }
    if(password == user.password){
      return callback(null, user);
    }
    return callback(new Error('Invalid Password'));
  });
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
