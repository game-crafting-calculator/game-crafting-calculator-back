//MongoDB user model
const RecipeModel = require('../models/Recipe');

exports.getAll = async (req, res) => {
    const items = await RecipeModel.find();
    res.send(items);
}

exports.getOneByName = async (req, res) => {
    const itemOnly = new RegExp(req.params.searchTerm, 'i');
    const items = await RecipeModel.find({name: {$regex:searchRegex}})
    res.send(items);
}

exports.getOneById = async (req, res) => {
    const items = await RecipeModel.findById(req.params.foodId)
    res.send(items);
}

exports.createRecipe = async (req, res) => {
    delet
    const recipeObject = JSON.parse(req.body.recipe);
    delet
    

}