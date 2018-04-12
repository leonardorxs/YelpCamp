const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  username: { 
    type: String,
    trim: true,
    required: true,
    unique: true,
    minlength: [3, "O nome de usuário deve ter entre 3 e 12 caracteres."],
    maxlength: [12, "O nome de usuário deve ter entre 3 e 12 caracteres."]
  },
  password: { 
      type: String,
      trim: true,
      minlength: [8, "A senha deve ter entre 8 e 20 caracteres"],
      maxlength: [20, "A senha deve ter entre 8 e 20 caracteres"] 
    },
  date: { type: Date, default: Date.now },
  active: {type: Boolean, default: true}
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);