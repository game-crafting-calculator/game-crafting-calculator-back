const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    name:{ type:String, required:true, unique:true},
    image:{ type:String, required:true, unique:true},
    recipesID:[{ type: mongoose.Types.ObjectId, ref:"Recipe" }]
});


module.exports = mongoose.model('Item', userSchema);

