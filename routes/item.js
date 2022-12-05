const express = require('express');
const router = express.Router();

//Authentification token
const auth = require('../middleware/auth');

const itemCtrl = require('../controllers/item');

router.get('/', auth, itemCtrl.getAll);
router.get('/:id', auth, itemCtrl.getOneByName);
router.get('/:id', auth, itemCtrl.getOneById);

module.exports = router;