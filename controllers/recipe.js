//MongoDB user model
const RecipeModel = require('../models/Recipe');

exports.getAll = async (req, res) => {
    const items = await RecipeModel.find();
    res.send(items);
}

exports.getOneById = async (req, res) => {
    const items = await RecipeModel.findById(req.params.id)
    res.send(items);
}

exports.createRecipe = async (req, res) => {
    delete req.body._id;
    const recipe = new RecipeModel({
      ...req.body
    });

    recipe.save()
    .then(() => res.status(201).json({message: 'Recipe save !'}))
    .catch((error) => res.status(400).json({error}));
}

exports.modifyRecipe = (req, res) => {
    RecipeModel.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Recipe modify !'}))
    .catch((error) => res.status(400).json({error}));
}