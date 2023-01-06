const pool = require("./../database/db-connect");
const validator = require("validator");

let controller = {};

/*--------------------------------------------------------------------------------

------------------------------------ITEM GET ALL----------------------------------

----------------------------------------------------------------------------------*/

controller.getAll = async () => {
  // Selectionne tous les itemes
  let item;

  try {
    item = await pool.query("SELECT * FROM item");
  } catch (error) {
    console.log("DEV - itemController - getAll - select item\n", error);
  }

  // Si la ligne à selectionner est innexistante, renvoyer "false"
  item = item.rows;

  if (!item) {
    return [false, "item does not exsits"];
  }

  return [item, ""];
};

/*--------------------------------------------------------------------------------

-----------------------------------ITEM GET BY NAME-------------------------------

----------------------------------------------------------------------------------*/

controller.getOneByName = async (item_name) => {
  //Selectionne les items par noms
  let item;

  try {
    item = await pool.query(
      `SELECT item_name, image FROM item WHERE item_name = $1`,
      [item_name]
    );
  } catch (error) {
    console.log(
      "DEV - itemController - getOneByName - select item_name\n",
      error
    );
  }

  // Si la ligne à selectionner est innexistante, renvoyer "false"
  item = item.rows[0];

  if (!item) {
    return [false, "item does not exsits"];
  }

  return [item, ""];
};

/*--------------------------------------------------------------------------------

------------------------------------ITEM GET BY ID--------------------------------

----------------------------------------------------------------------------------*/

controller.getOneById = async (item_id) => {
  //Selectionne les itemes par l'id
  let item;

  try {
    item = await pool.query(
      `SELECT item_name, image FROM item WHERE item_id = $1`,
      [item_id]
    );
  } catch (error) {
    console.log("DEV - itemController - getOneById - select item_id\n", error);
  }

  // Si la ligne à selectionner est innexistante, renvoyer "false"
  item = item.rows[0];

  if (!item) {
    return [false, "item does not exsits"];
  }

  return [item, ""];
};

/*--------------------------------------------------------------------------------

-------------------------------------CREATE ITEM----------------------------------

----------------------------------------------------------------------------------*/

controller.postItem = async (item_name, image) => {
  //vérifier que le item_name n'est pas déjà utilisé
  try {
    let itemExists = await pool.query(
      "SELECT item_name FROM item WHERE item_name = $1",
      [item_name]
    );

    // Si la ligne à selectionner est déjà existante, renvoyer "false"
    if (itemExists.rows[0]) {
      return [false, "Item name already used"];
    }
  } catch (error) {
    console.log(
      "DEV - itemController - createItem - select item_name error",
      error
    );
    return [false, "server error"];
  }

  //vérifier que l'image n'est pas déjà utilisé
  try {
    let imageExists = await pool.query(
      "SELECT image FROM item WHERE image = $1",
      [image]
    );

    // Si la ligne à selectionner est déjà existante, renvoyer "false"
    if (imageExists.rows[0]) {
      return [false, "image already used"];
    }
  } catch (error) {
    console.log("DEV - itemController - createImage - select image error");
    return [false, "server error"];
  }

  //creer l'item
  try {
    await pool.query(
      `
        INSERT INTO item (
          item_name,
          image
        )
        VALUES(
          $1,
          $2
        )
      `,
      [item_name, image]
    );

    return [true, "item account created !"];
  } catch (error) {
    console.log(
      "DEV - itemController - createItem - insert bdd error\n",
      error
    );
    return [false, "server error"];
  }
};

/*--------------------------------------------------------------------------------

-------------------------------------UPDATE ITEM----------------------------------

----------------------------------------------------------------------------------*/

controller.putItem = async (item_id, item_name, image) => {
  //Verifie que l'item à modifier est existant
  let item;
  try {
    item = await pool.query(
      `SELECT item_name, image FROM item WHERE item_id = $1`,
      [item_id]
    );

    // Si la ligne à selectionner est innexistante, renvoyer "false"
    if (item.rowCount === 0) {
      res.status(400).json({ message: "item is not exist" });
      return false;
    }
  } catch (error) {
    console.log("DEV - itemController - getUpdate - select item\n", error);
  }

  item = item.rows[0];

  //item_name retourne la modification sinon retourne l'ancien nom
  item_name = item_name || item.item_name;

  //Modifie l'item
  try {
    await pool.query(
      `
        UPDATE item
        SET
          item_name = $2,
          image = $3
        WHERE item_id = $1;
      `,
      [item_id, item_name, image]
    );
  } catch (error) {
    console.log("DEV - itemController - update - pg update error\n", error);
    return [false, "server error"];
  }

  return [true, ""];
};

/*--------------------------------------------------------------------------------

-------------------------------------DELETE ITEM----------------------------------

----------------------------------------------------------------------------------*/

controller.deleteItem = async (item_id) => {
  //Delete l'item
  let deleteItem;

  try {
    deleteItem = await pool.query(`DELETE FROM item WHERE item_id = $1`, [
      item_id,
    ]);
  } catch (error) {
    console.log("DEV - itemController - deleteItem - delete item\n", error);
    return [true, "server error"];
  }

  // Si la ligne à delete est innexistante, renvoyer "false"
  if (deleteItem.rowCount === 0) {
    return [false, "item does not exists"];
  }

  return [true, ""];
};

module.exports = controller;
