const pool = require("./../database/db-connect");
const validator = require("validator");

let controller = {};

/*--------------------------------------------------------------------------------

------------------------------------RECIPE GET ALL--------------------------------

----------------------------------------------------------------------------------*/

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

  recipe = recipe.rows;

  if (!recipe) {
    return [false, "recipe does not exsits"];
  }

  return [recipe, ""];
};

/*--------------------------------------------------------------------------------

----------------------------------RECIPE GET BY NAME------------------------------

----------------------------------------------------------------------------------*/

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

/*--------------------------------------------------------------------------------

-----------------------------------RECIPE GET BY ID-------------------------------

----------------------------------------------------------------------------------*/

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

/*--------------------------------------------------------------------------------

----------------------------------RECIPE GET COMPLETE-----------------------------

----------------------------------------------------------------------------------*/

controller.getCompleteById = async (recipe_id) => {
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

/*--------------------------------------------------------------------------------

-------------------------------------CREATE RECIPE--------------------------------

----------------------------------------------------------------------------------*/

controller.postRecipe = async (item_id, per_craft, ingredients) => {
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

/*--------------------------------------------------------------------------------

-------------------------------------MODIFY RECIPE--------------------------------

----------------------------------------------------------------------------------*/

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

/*--------------------------------------------------------------------------------

------------------------------------DELETE RECIPE---------------------------------

----------------------------------------------------------------------------------*/

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

/*--------------------------------------------------------------------------------

--------------------------------RECIPE GET INGREDIENT-----------------------------

----------------------------------------------------------------------------------*/
controller.getIngredients = async (recipe_id) => {
  //Selectionner tous les ingredients d'une recette
  try {
    let data = await pool.query(
      `
        SELECT needs.item_id, needs.quantity, item.item_name, item.image
        FROM needs
        INNER JOIN item ON needs.item_id = item.item_id
        WHERE recipe_id = $1
      `,
      [recipe_id]
    );

    // Si la ligne à selectionner est innexistante, renvoyer "false"
    if (data.rowCount === 0) {
      return [false, "ingredients not found"];
    }

    return [data.rows, ""];
  } catch (error) {
    console.log(error);
    return [false, "server error"];
  }
};

/*--------------------------------------------------------------------------------

----------------------------------GET COMPLETE RECIPE-----------------------------

----------------------------------------------------------------------------------*/

controller.getCompleteRecipe = async (recipe_id, quantity) => {
  //Selectionne l'integralitée des éléments de la recette
  let recipe = {};
  try {
    let data = await pool.query(
      `
        SELECT item.item_name, item.image, recipe.per_craft, recipe.recipe_id, item.item_id
        FROM recipe
        INNER JOIN item ON recipe.item_id = item.item_id
        WHERE recipe_id = $1
      `,
      [recipe_id]
    );

    // Si la ligne à selectionner est innexistante, renvoyer "false"
    if (data.rowCount === 0) {
      return [false, "ingredients not found"];
    }

    recipe = data.rows[0];
  } catch (error) {
    console.log(error);
    return [false, "server error"];
  }

  //Verifie que les ingredients sont existants
  let [ingredients, error] = await controller.getIngredients(recipe_id);
  if (!ingredients) {
    return [false, error];
  }

  //Additionnes les recettes per_craft
  let numberOfCrafts = Math.ceil(quantity / recipe.per_craft);
  console.log(numberOfCrafts);

  ingredients = ingredients.map((ing) => ({
    ...ing,
    quantity: ing.quantity * numberOfCrafts,
  }));

  recipe.ingredients = ingredients;

  return [recipe, ""];
};

/*--------------------------------------------------------------------------------

------------------------------------GET RECIPE TREE-------------------------------

----------------------------------------------------------------------------------*/

controller.getRecipeTree = async (recipe_id, quantity) => {
  //Verifie que les ingredients de l'arbres sont existants
  let [tree, error] = await controller.getCompleteRecipe(recipe_id, quantity);

  if (!tree) {
    return [false, error];
  }

  let stack = [tree];

  while (stack.length > 0) {
    let current = stack.pop();

    if (!current.ingredients) {
      continue;
    }

    current.ingredients = await Promise.all(
      current.ingredients.map(async (ing) => {
        let [recipe, error] = await controller.getCompleteRecipe(
          ing.id,
          ing.quantity
        );

        if (!recipe) {
          return ing;
        }

        stack.push(recipe);
      })
    );
  }

  return [tree, ""];
};

module.exports = controller;
