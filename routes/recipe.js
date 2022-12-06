const express = require('express');
const router = express.Router();
const recipeCtrl = require('../controllers/recipe');

router.get('/favoris', recipeCtrl.getAll);
router.get('/favoris', recipeCtrl.getOneById);
router.get('/favoris', recipeCtrl.createRecipe);
router.get('/favoris', recipeCtrl.modifyRecipe);
router.get('/favoris', recipeCtrl.deleteRecipe);

module.exports = router;