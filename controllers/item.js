//MongoDB user model
const Item = require('../models/Item');
const ItemModel = require('../models/Item');
const RecipeModel = require('../models/Recipe');


exports.getAll = async (req, res) => {
    const items = await ItemModel.find();
    res.send(items);
}

exports.getOneByName = async (req, res) => {
    const itemOnly = new RegExp(req.params.searchTerm, 'i');
    const items = await ItemModel.find({name: {$regex:searchRegex}})
    res.send(items);
}

exports.getOneById = async (req, res) => {
    const items = await ItemModel.findById(req.params.foodId)
    res.send(items);
}

// const updateItemsBDD = async() =>{
//     const recipes = await RecipeModel.find()
//     recipes.forEach(async (e)=>{
//         await e.populate("recipeResultID")
//         let name = e.recipeResultID.name
//         let item = await ItemModel.findOne({name})
//         item.recipesID =  item.recipesID || []
//         item.recipesID.push(e)
//         console.log(item);
//         await item.save()
//     })
// }
// updateItemsBDD()