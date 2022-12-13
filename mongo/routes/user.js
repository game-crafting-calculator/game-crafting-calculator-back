const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

const auth = require('../middleware/auth');
const { route } = require('./recipe');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
//fonction suivante => auth tous ce qui suit
router.use(auth);
// router.get('/user', userCtrl.getUser);
router.get('/favoris', userCtrl.getFavoris);

router.put('/profile', userCtrl.modifyUser);
router.delete('/profile', userCtrl.deleteUser);
router.get('/profile', userCtrl.getProfile);


module.exports = router;