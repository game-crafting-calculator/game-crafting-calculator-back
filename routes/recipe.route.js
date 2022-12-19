const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipe.controller");

const getMissingParameters =
  require("../utils/missing-parameters").getMissingParameter;

//ROUTE GET ALL
router.get("/", async (req, res) => {
  let [result, error] = await recipeController.getAll();

  if (!result) {
    res.status(400).json({ error });
    return false;
  }

  res.status(200).json(result);
});

/////////////////////////////////////////////////////////////////////////////////////////////////

//ROUTE GET BY NAME
router.get("/name/:recipe_name", async (req, res) => {
  //on recupère des données de la requete
  let { recipe_name } = req.params;

  //On verifie que les données sont existants
  let missing = getMissingParameters({ recipe_name });

  if (missing) {
    res.status(400).json({ error: "missing", parameters: missing });
    return false;
  }

  let [result, error] = await recipeController.getOneByName(recipe_name);

  if (!result) {
    res.status(400).json({ error });
    return false;
  }

  res.status(200).json(result);
});

/////////////////////////////////////////////////////////////////////////////////////////////////

//ROUTE GET BY ID
router.get("/id/:recipe_id", async (req, res) => {
  //on recupère des données de la requete
  let { recipe_id } = req.params;

  //On verifie que les données sont existants

  let missing = getMissingParameters({ recipe_id });

  if (missing) {
    res.status(400).json({ error: "missing", parameters: missing });
    return false;
  }

  let [result, error] = await recipeController.getOneById(recipe_id);

  if (!result) {
    res.status(400).json({ error });
    return false;
  }

  res.status(200).json(result);
});

/////////////////////////////////////////////////////////////////////////////////////////////////

//ROUTE CREATE
router.post("/", async (req, res) => {
  //on récupére les données de la requéte
  let { item_id, per_craft, ingredients } = req.body;

  //On verifie que les données sont existants
  let missing = getMissingParameters({ item_id, per_craft, ingredients });
  if (missing) {
    res.status(400).json({ error: "missing", parameters: missing });
    return false;
  }

  let [result, error] = await recipeController.postRecipe(
    item_id,
    per_craft,
    ingredients
  );
  if (!result) {
    res.status(400).json({ error });
    return false;
  }

  res.status(200).json(result);
});

/////////////////////////////////////////////////////////////////////////////////////////////////

//ROUTE MODIFY
router.put("/:recipe_id", async (req, res) => {
  //on récupére les données de la requéte
  let { recipe_id } = req.params;
  let { recipe_name, image } = req.body;

  //On verifie que les données sont existants
  let missing = getMissingParameters({ recipe_id });
  if (missing) {
    res.status(400).json({ error: "missing", parameters: missing });
    return false;
  }

  let [result, error] = await recipeController.putrecipe(
    recipe_id,
    recipe_name,
    image
  );

  if (!result) {
    res.status(400).json({ error });
    return false;
  }

  res.status(200).json(result);
});

/////////////////////////////////////////////////////////////////////////////////////////////////

//ROUTE DELETE
router.delete("/:recipe_id", async (req, res) => {
  //on récupére les données de la requéte
  let { recipe_id } = req.params;

  //On verifie que les données sont existants
  let missing = getMissingParameters({ recipe_id });
  if (missing) {
    res.status(400).json({ error: "missing", parameters: missing });
    return false;
  }

  let [result, error] = await recipeController.deleterecipe(recipe_id);
  if (!result) {
    res.status(400).json({ error });
    return false;
  }

  res.status(200).json(result);
});

module.exports = router;
