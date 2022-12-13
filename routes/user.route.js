const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

const auth = require('../middleware/auth');
const getMissingParameters = require('../utils/missing-parameters').getMissingParameter;



router.post('/signup', async (req, res) => {
  //on récupére les données de la requéte
  let {username, email, password} = req.body
  
  //On verifie que les données sont existants
  let missing = getMissingParameters({username, email, password})
  if(missing){
    res.status(400).json({error:"missing", parameters:missing})
  }

  let [result, error] = await userController.createAccount(username, email, password)
  if (!result) {
    res.status(400).json({error})
    return false
  }

  res.status(200).json(result)
});


router.post('/login', userCtrl.login);
//fonction suivante => auth tous ce qui suit
router.use(auth);
// router.get('/user', userCtrl.getUser);
router.get('/favoris', userCtrl.getFavoris);

router.put('/profile', userCtrl.modifyUser);
router.delete('/profile', userCtrl.deleteUser);
router.get('/profile', userCtrl.getProfile);


module.exports = router;