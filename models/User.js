const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    username:{ type:String, required:true, unique:true},
    email:{ type:String, required:true, unique:true },
    password:{ type:String, required:true},
    registration_date:{ type:Date, required:true},
    last_connection:{ type:Date, required:true},
    favoris:{type: Array, "default" : []},
    verified:{ type:Boolean, required:true}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);