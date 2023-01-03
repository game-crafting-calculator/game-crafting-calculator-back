const pool = require("./../database/db-connect");

let controller = {};

/*--------------------------------------------------------------------------------

-----------------------------------CREATE FAVORIS---------------------------------

----------------------------------------------------------------------------------*/

controller.postFavoris = async (user_id, recipe_id) => {
  //vérifier que le favoris lier à l'utilisateur n'est pas déjà utilisé
  try {
    let favorisExists = await pool.query(
      `
        SELECT recipe_id 
        FROM bookmarks 
        WHERE recipe_id = $2
        AND user_id = $1
        `,
      [user_id, recipe_id]
    );

    // Si la ligne à creer existe déjà, renvoyer "false"
    if (favorisExists.rows[0]) {
      return [false, "This favoris already used"];
    }
  } catch (error) {
    console.log(
      "DEV - favorisController - createFavoris - select favoris error",
      error
    );
    return [false, "server error"];
  }

  //creer le favoris
  try {
    await pool.query(
      `
            INSERT INTO bookmarks (
              user_id,
              recipe_id
            )
            VALUES(
              $1,
              $2
            )
          `,
      [user_id, recipe_id]
    );

    return [true, "Favoris recipe created !"];
  } catch (error) {
    console.log(
      "DEV - favorisController - createFavoris - insert favoris in bdd error\n",
      error
    );
    return [false, "server error"];
  }
};

/*--------------------------------------------------------------------------------

-----------------------------------DELETE FAVORIS---------------------------------

----------------------------------------------------------------------------------*/

controller.deleteFavoris = async (recipe_id) => {
  // Supprime le Favoris
  let deleteFavoris;

  try {
    deleteFavoris = await pool.query(
      `
      DELETE FROM bookmarks 
      WHERE recipe_id = $1
      `,
      [recipe_id]
    );
  } catch (error) {
    console.log(
      "DEV - favorisController - deleteFavoris - delete favoris\n",
      error
    );
    return [true, "server error"];
  }

  // Si la ligne à supprimer est innexistante, renvoyer "false"
  if (deleteFavoris.rowCount === 0) {
    return [false, "favoris does not exists"];
  }

  return [true, ""];
};

/*--------------------------------------------------------------------------------

----------------------------------FAVORIS GET ALL---------------------------------

----------------------------------------------------------------------------------*/

controller.getFavoris = async (user_id) => {
  // Selectionne les éléments de la recette à renvoyer dans les favoris
  let bookmark;
  try {
    bookmark = await pool.query(
      `      
        SELECT item.item_name, item.image, bookmarks.recipe_id, recipe.per_craft
        FROM bookmarks
        INNER JOIN recipe
        ON bookmarks.recipe_id = recipe.recipe_id
        INNER JOIN item
        ON recipe.item_id = item.item_id
        WHERE bookmarks.user_id = $1
        `,
      [user_id]
    );

    bookmark = bookmark.rows;
  } catch (error) {
    console.log(
      "DEV - favorisController - getFavoris - select recipe_id\n",
      error
    );
  }

  // Si la ligne à selectionner est innexistante, renvoyer "false"

  if (!bookmark) {
    return [false, "bookmark does not exsits"];
  }

  return [bookmark, ""];
};

module.exports = controller;
