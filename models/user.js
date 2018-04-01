const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  username: { 
    type: String,
    required: true,
    unique: true
  },
  password: { 
    type: String,
    required: true    
  },
  date: { type: Date, default: Date.now },
  active: {type: Boolean, default: true}
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);