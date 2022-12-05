//MongoDB user model
const ItemModel = require('../models/Item');

exports.getAll = async (req, res) => {
    const items = await ItemModel.find();
    res.send(items);
}

exports.getOneByName = async (req, res) => {
    const itemOnly = new RegExp(req.params.searchTerm, 'i');
    const items = await ItemModel.find({name: {$regex:searchRegex}})
    res.send(items);
}

exports.getOneById = async (req, res) => {
    const items = await ItemModel.findById(req.params.foodId)
    res.send(items);
}