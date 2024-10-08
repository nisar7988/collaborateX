const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:{type:String,required:true},
  username:{type:String,required:true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  connections: {type: [String]},
  profilePicture:{type:String},
  phone:{type:String},
  bio:{type:String}

});

const User = mongoose.model('User', userSchema);
module.exports = User;
