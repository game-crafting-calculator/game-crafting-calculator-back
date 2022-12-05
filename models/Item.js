const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    name:{ type:String, required:true, unique:true},
    image:{ type:String, required:true, unique:true},
});


module.exports = mongoose.model('Item', userSchema);