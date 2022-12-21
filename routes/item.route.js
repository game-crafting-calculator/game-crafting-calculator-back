const express = require("express");
const router = express.Router();
const itemController = require("../controllers/item.controller");

const getMissingParameters =
  require("../utils/missing-parameters").getMissingParameter;

/*--------------------------------------------------------------------------------

------------------------------------ROUTE GET ALL---------------------------------

----------------------------------------------------------------------------------*/

router.get("/", async (req, res) => {
  let [result, error] = await itemController.getAll();

  if (!result) {
    res.status(400).json({ error });
    return false;
  }

  res.status(200).json(result);
});

/*--------------------------------------------------------------------------------

----------------------------------ROUTE GET BY NAME-------------------------------

----------------------------------------------------------------------------------*/

router.get("/name/:item_name", async (req, res) => {
  //on recupère des données de la requete
  let { item_name } = req.params;

  //On verifie que les données sont existants
  let missing = getMissingParameters({ item_name });

  if (missing) {
    res.status(400).json({ error: "missing", parameters: missing });
    return false;
  }

  let [result, error] = await itemController.getOneByName(item_name);

  if (!result) {
    res.status(400).json({ error });
    return false;
  }

  res.status(200).json(result);
});

/*--------------------------------------------------------------------------------

-----------------------------------ROUTE GET BY ID--------------------------------

----------------------------------------------------------------------------------*/

router.get("/id/:item_id", async (req, res) => {
  //on recupère des données de la requete
  let { item_id } = req.params;

  //On verifie que les données sont existants

  let missing = getMissingParameters({ item_id });

  if (missing) {
    res.status(400).json({ error: "missing", parameters: missing });
    return false;
  }

  let [result, error] = await itemController.getOneById(item_id);

  if (!result) {
    res.status(400).json({ error });
    return false;
  }

  res.status(200).json(result);
});

/*--------------------------------------------------------------------------------

-------------------------------------ROUTE CREATE---------------------------------

----------------------------------------------------------------------------------*/

router.post("/", async (req, res) => {
  //on récupére les données de la requéte
  let { item_name, image } = req.body;

  //On verifie que les données sont existants
  let missing = getMissingParameters({ item_name, image });
  if (missing) {
    res.status(400).json({ error: "missing", parameters: missing });
    return false;
  }

  let [result, error] = await itemController.postItem(item_name, image);
  if (!result) {
    res.status(400).json({ error });
    return false;
  }

  res.status(200).json(result);
});

/*--------------------------------------------------------------------------------

-------------------------------------ROUTE MODIFY---------------------------------

----------------------------------------------------------------------------------*/

router.put("/:item_id", async (req, res) => {
  //on récupére les données de la requéte
  let { item_id } = req.params;
  let { item_name, image } = req.body;

  //On verifie que les données sont existants
  let missing = getMissingParameters({ item_id });
  if (missing) {
    res.status(400).json({ error: "missing", parameters: missing });
    return false;
  }

  let [result, error] = await itemController.putItem(item_id, item_name, image);

  if (!result) {
    res.status(400).json({ error });
    return false;
  }

  res.status(200).json(result);
});

/*--------------------------------------------------------------------------------

-------------------------------------ROUTE DELETE---------------------------------

----------------------------------------------------------------------------------*/

router.delete("/:item_id", async (req, res) => {
  //on récupére les données de la requéte
  let { item_id } = req.params;

  //On verifie que les données sont existants
  let missing = getMissingParameters({ item_id });
  if (missing) {
    res.status(400).json({ error: "missing", parameters: missing });
    return false;
  }

  let [result, error] = await itemController.deleteItem(item_id);
  if (!result) {
    res.status(400).json({ error });
    return false;
  }

  res.status(200).json(result);
});

module.exports = router;
