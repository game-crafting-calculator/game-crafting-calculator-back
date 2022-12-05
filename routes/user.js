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
router.put('/modify', userCtrl.modifyUser);
router.delete('/delete', userCtrl.deleteUser);

router.get('/profile', userCtrl.getProfile);


module.exports = router;