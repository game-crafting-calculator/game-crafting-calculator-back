const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

const auth = require("../middleware/auth");
const getMissingParameters =
  require("../utils/missing-parameters").getMissingParameter;

/*--------------------------------------------------------------------------------

-------------------------------------ROUTE SIGNUP---------------------------------

----------------------------------------------------------------------------------*/

router.post("/signup", async (req, res) => {
  //on récupére les données de la requéte
  let { username, email, password } = req.body;

  //On verifie que les données sont existants
  let missing = getMissingParameters({ username, email, password });
  if (missing) {
    res.status(400).json({ error: "missing", parameters: missing });
    return false;
  }

  let [result, error] = await userController.createAccount(
    username,
    email,
    password
  );
  if (!result) {
    res.status(400).json({ error });
    return false;
  }

  res.status(200).json(result);
});

/*--------------------------------------------------------------------------------

-------------------------------------ROUTE LOGIN----------------------------------

----------------------------------------------------------------------------------*/

router.post("/login", async (req, res) => {
  //on récupére les données de la requéte
  let { email, password } = req.body;

  //On verifie que les données sont existants
  let missing = getMissingParameters({ email, password });
  if (missing) {
    res.status(400).json({ error: "missing", parameters: missing });
    return false;
  }

  let [result, error] = await userController.login(email, password);
  if (!result) {
    res.status(400).json({ error });
    return false;
  }

  res.status(200).json(result);
});

/*--------------------------------------------------------------------------------

-------------------------------------ROUTE AUTH-----------------------------------

----------------------------------------------------------------------------------*/

//fonction suivante => auth tous ce qui suit
router.use(auth);

/*--------------------------------------------------------------------------------

----------------------------------ROUTE GET PROFILE-------------------------------

----------------------------------------------------------------------------------*/
router.get("/profile", async (req, res) => {
  //on récupére les données de la requéte
  let { user_id } = req.user;

  //On verifie que les données sont existants
  let missing = getMissingParameters({ user_id });

  if (missing) {
    res.status(400).json({ error: "missing", parameters: missing });
    return false;
  }

  let [result, error] = await userController.getProfile(user_id);

  if (!result) {
    res.status(400).json({ error });
    return false;
  }

  res.status(200).json(result);
});

/*--------------------------------------------------------------------------------

-------------------------------------ROUTE MODIFY---------------------------------

----------------------------------------------------------------------------------*/

router.put("/profile", async (req, res) => {
  //on récupére les données de la requéte
  let { user_id } = req.user;
  let { username, password } = req.body;

  //On verifie que les données sont existants
  let missing = getMissingParameters({ user_id });
  if (missing) {
    res.status(400).json({ error: "missing", parameters: missing });
    return false;
  }

  let [result, error] = await userController.updateProfile(
    user_id,
    username,
    password
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

router.delete("/", async (req, res) => {
  //on récupére les données de la requéte
  let { user_id } = req.user;

  //On verifie que les données sont existants
  let missing = getMissingParameters({ user_id });
  if (missing) {
    res.status(400).json({ error: "missing", parameters: missing });
    return false;
  }

  let [result, error] = await userController.deleteAccount(user_id);
  if (!result) {
    res.status(400).json({ error });
    return false;
  }

  res.status(200).json(result);
});

// router.get("/favoris", userCtrl.getFavoris);

module.exports = router;
