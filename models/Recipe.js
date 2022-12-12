const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    recipeResultID:{ type:mongoose.Schema.Types.ObjectId, required:true, ref:"Item"},
    perCraft:{type:Number, required:true},
    itemNeedsID:[{ type:mongoose.Schema.Types.ObjectId, required:true, ref:"Item"}],
    ingredients:[{
        itemID:{type:mongoose.Types.ObjectId, required:true, ref:"Item"},
        quantity:{type:Number, required:true}
    }]
});


module.exports = mongoose.model('Recipe', userSchema);



