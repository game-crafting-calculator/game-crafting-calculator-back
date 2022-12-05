const express = require('express');
const router = express.Router();
const recipeCtrl = require('../controllers/recipe');

router.get('/signup', recipeCtrl.getAll);
router.get('/signup', recipeCtrl.getOneById);
router.get('/signup', recipeCtrl.getOneByName);

module.exports = router;