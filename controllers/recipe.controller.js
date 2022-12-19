const pool = require("./../database/db-connect");
const validator = require("validator");

let controller = {};

// GET ALL
controller.getAll = async () => {
  let recipe;
  try {
    recipe = await pool.query(
      `
      SELECT item.item_name, recipe.recipe_id, item.image
      FROM recipe
      INNER JOIN item
      ON recipe.item_id = item.item_id
    `
    );
  } catch (error) {
    console.log("DEV - userController - getAll - select recipe\n", error);
    return [false, "server error"];
  }
  console.log(recipe);

  recipe = recipe.rows;

  if (!recipe) {
    return [false, "recipe does not exsits"];
  }

  return [recipe, ""];
};

/////////////////////////////////////////////////////////////////////////////////////////////////

// GET BY NAME
controller.getOneByName = async (item_name) => {
  let recipe;
  try {
    recipe = await pool.query(
      `      
      SELECT item.item_name, recipe.recipe_id, item.image
      FROM recipe
      INNER JOIN item
      ON recipe.item_id = item.item_id
      WHERE item_name = $1
      `,
      [item_name]
    );
  } catch (error) {
    console.log(
      "DEV - userController - getOneByName - select recipe item_name\n",
      error
    );
  }

  recipe = recipe.rows[0];

  if (!recipe) {
    return [false, "item does not exsits"];
  }

  return [recipe, ""];
};

/////////////////////////////////////////////////////////////////////////////////////////////////

//GET BY ID
controller.getOneById = async (recipe_id) => {
  let recipe;
  try {
    recipe = await pool.query(
      `      
      SELECT item.item_name, recipe.recipe_id, item.image
      FROM recipe
      INNER JOIN item
      ON recipe.item_id = item.item_id
      WHERE recipe_id = $1
      `,
      [recipe_id]
    );
  } catch (error) {
    console.log(
      "DEV - itemController - getOneById - select recipe_id\n",
      error
    );
  }

  recipe = recipe.rows[0];

  if (!recipe) {
    return [false, "item does not exsits"];
  }

  return [recipe, ""];
};

/////////////////////////////////////////////////////////////////////////////////////////////////

//CREATE RECIPE
controller.postRecipe = async (item_id, per_craft, ingredients) => {
  //creer le compte utilisateur
  let recipe_id;

  try {
    recipe_id = await pool.query(
      `
        INSERT INTO recipe (item_id, per_craft)
        VALUES($1, $2)
        RETURNING recipe_id
        `,
      [item_id, per_craft]
    );

    recipe_id = recipe_id.rows[0].recipe_id;
  } catch (error) {
    console.log(
      "DEV - recipeController - createRecipe - insert bdd recipe_1 error\n",
      error
    );
    return [false, "server error"];
  }

  try {
    for (const ing of ingredients) {
      await pool.query(
        `
       INSERT INTO needs (recipe_id, item_id, quantity)
        VALUES($1, $2, $3)
       `,
        [recipe_id, ing.item_id, ing.quantity]
      );
    }
  } catch (error) {
    console.log(
      "DEV - recipeController - createRecipe - insert bdd recipe_2 error\n",
      error
    );
    return [false, "server error"];
  }

  return [true, ""];
};

/////////////////////////////////////////////////////////////////////////////////////////////////

// UPDATE ITEM
controller.putRecipe = async (item_id, item_name, image) => {
  //find item
  let recipe_id;

  try {
    recipe_id = await pool.query(
      `
        UPDATE recipe (item_id, per_craft)
        SET
          item_id = $2,
          per_craft = $3
        WHERE recipe_id = $1;
      `,
      [recipe_id, item_id, per_craft]
    );

    recipe_id = recipe_id.row[0].recipe_id;
  } catch (error) {
    console.log(
      "DEV - itemController - update - pg update recipe_1 error\n",
      error
    );
    return [false, "server error"];
  }

  try {
    for (const ing of ingredients) {
      await pool.query(
        `
        UPDATE needs (recipe_id, item_id, quantity)
        SET
          recipe_id = $1
          item_id = $2
          quantity = $3
        WHERE recipe_id = $1
        `[(recipe_id, ing.item_id, ing.quantity)]
      );
    }
  } catch (error) {
    console.log(
      "DEV - itemController - update - pg update recipe_2 error\n",
      error
    );
    return [false, "server error"];
  }

  return [true, ""];
};

/////////////////////////////////////////////////////////////////////////////////////////////////

// DELETE ITEM
controller.deleteRecipe = async (recipe_id) => {
  let deleteRecipe;
  try {
    deleteRecipe = await pool.query(
      `
      DELETE FROM recipe 
      WHERE recipe_id = $1
      `,
      [recipe_id]
    );
  } catch (error) {
    console.log("DEV - itemController - deleteItem - delete item\n", error);
    return [true, "server error"];
  }

  try {
    deleteRecipe = await pool.query(
      `
      DELETE FROM need 
      WHERE recipe_id = $1
      `,
      [recipe_id]
    );
  } catch (error) {
    console.log("DEV - itemController - deleteItem - delete item\n", error);
    return [true, "server error"];
  }

  if (deleteRecipe.rowCount === 0) {
    return [false, "item does not exists"];
  }

  return [true, ""];
};

module.exports = controller;
