const express = require('express');
const router = express.Router();
const recipeCtrl = require('../controllers/recipe');

router.get('/', recipeCtrl.getAll);
router.get('/:id', recipeCtrl.getOneById);
router.post('/', recipeCtrl.createRecipe);
router.put('/:id', recipeCtrl.modifyRecipe);
router.delete('/:id', recipeCtrl.deleteRecipe);
router.get("/tree/:id", recipeCtrl.getRecipeTree)

module.exports = router;