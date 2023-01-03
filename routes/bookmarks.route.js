const express = require("express");
const router = express.Router();
const bookmarksController = require("../controllers/bookmarks.controller");

const auth = require("../middleware/auth");
const getMissingParameters =
  require("../utils/missing-parameters").getMissingParameter;

/*--------------------------------------------------------------------------------

-------------------------------------ROUTE AUTH------------------------------------

----------------------------------------------------------------------------------*/

router.use(auth);

/*--------------------------------------------------------------------------------

-------------------------------------ROUTE CREATE---------------------------------

----------------------------------------------------------------------------------*/

router.post("/", async (req, res) => {
  //on récupére les données de la requéte
  let { user_id } = req.user;
  let { recipe_id } = req.body;

  //On verifie que les données sont existants
  let missing = getMissingParameters({ user_id, recipe_id });
  if (missing) {
    res.status(400).json({ error: "missing", parameters: missing });
    return false;
  }

  let [result, error] = await bookmarksController.postFavoris(
    user_id,
    recipe_id
  );
  if (!result) {
    res.status(400).json({ error });
    return false;
  }

  res.status(200).json(result);
});

/*--------------------------------------------------------------------------------

-------------------------------------ROUTE DELETE---------------------------------

----------------------------------------------------------------------------------*/

router.delete("/:recipe_id", async (req, res) => {
  //on récupére les données de la requéte
  let { user_id } = req.user;
  let { recipe_id } = req.params;

  //On verifie que les données d'utilisateur et la recette sont existants
  let missing = getMissingParameters({ user_id, recipe_id });
  if (missing) {
    res.status(400).json({ error: "missing", parameters: missing });
    return false;
  }

  //On envoit la requete delete avec l'id de la recette à supprimer
  let [result, error] = await bookmarksController.deleteFavoris(recipe_id);
  if (!result) {
    res.status(400).json({ error });
    return false;
  }

  res.status(200).json(result);
});

/*--------------------------------------------------------------------------------

---------------------------------ROUTE GET FAVORIS---------------------------------

----------------------------------------------------------------------------------*/

router.get("/", async (req, res) => {
  //on recupère des données de la requete
  let { user_id } = req.user;

  //On verifie que les données sont existants
  let missing = getMissingParameters({ user_id });

  if (missing) {
    res.status(400).json({ error: "missing", parameters: missing });
    return false;
  }

  let [result, error] = await bookmarksController.getFavoris(user_id);

  if (!result) {
    res.status(400).json({ error });
    return false;
  }

  res.status(200).json(result);
});

module.exports = router;
