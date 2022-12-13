exports.copyRecipeModel = (recipe) =>{
  let {recipeResultID, perCraft, ingredients} = recipe

  ingredients = ingredients.map((e)=>{
    return {
      itemID: e.itemID,
      quantity: e.quantity
    }
  })

  return {recipeResultID, perCraft, ingredients}
}