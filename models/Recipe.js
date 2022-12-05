const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    recipeResultsID:{ type:mongoose.Schema.Types.ObjectId, required:true, ref:"Item"},
    itemNeedsID:[{ type:mongoose.Schema.Types.ObjectId, required:true, ref:"Item"}],
});


module.exports = mongoose.model('Recipe', userSchema);



