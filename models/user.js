const { types, string, required } = require('joi');
const mongoose = require('mongoose');
const passportlocalmongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    }
})

userSchema.plugin(passportlocalmongoose);

const User = mongoose.model("User",userSchema);

module.exports = User;