//MongoDB user model
const RecipeModel = require('../models/Recipe');
const copyRecipeModel = require('../utils/crafting/copy-recipe-model').copyRecipeModel

exports.getAll = async (req, res) => {
    const recipes = await RecipeModel.find();
    let items = []
    for (const iterator of recipes) {
        await iterator.populate('recipeResultID', 'name image')
        items.push(iterator.recipeResultID)
    }
    
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

exports.modifyRecipe = async (req, res) => {
    RecipeModel.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Recipe modify !'}))
    .catch((error) => res.status(400).json({error}));
}

exports.deleteRecipe = (req, res, next) => {
    RecipeModel.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Recipe delete !'}))
    .catch((error) => res.status(400).json({error}));
}

const getRecipe = async (id) =>{
    let recipe = await RecipeModel.findOne({_id:id})
    if(!recipe){
        return false
    }

    return recipe
}


exports.getRecipeTree = async (req,res) => {
    let tree = await getRecipe(startItemName, quantity);
    tree.quantity = tree.perCraft;
    let stack = [tree];
  
    //while current or stack exists
    while (stack.length > 0) {
        current = stack.pop();
        if (current && current.ingredients) {
            current.ingredients = current.ingredients.map((e) => {
                let item = getRecipe(e._id);
                
                if (item) {
                    item.quantity = e.quantity;
                    return item;
                } else {
                
                return e;
            }

            
            });

            for (let index = 0; index < current.ingredients.length; index++) {
                let recipe = await getRecipe(e._id);

                if (recipe) {
                    recipe.quantity = current.ingredients[index].quantity
                    current.ingredients[index] = recipe
                }

                current.ingredients[index];
            }
    
          stack.push(...current.ingredients);
        }
        
    }
  
    return tree;
  }