

let recipe = [...recipeFile];

exports.findItem = (name) => {
  return recipe.find((e) => e.name === name) || false;
};

exports.getIngredients = (name) => {
  return findItem(name)?.ingredients || false;
};

exports.getRecipe = (name, quantity)=> {
  let item = { ...findItem(name) };
  // console.log(name, quantity, item);

  let craftAmount = Math.ceil(quantity / item.perCraft);

  if (!item) {
    return false;
  }

  if (!item.ingredients) {
    return item;
  }

  item.ingredients = item.ingredients.map((e) => {
    return {
      name: e.name,
      quantity: e.quantity * craftAmount,
    };
  });

  return { ...item };
}

exports.logLine = (level, line) => {
  return "  ".repeat(level) + "| " + line;
}

exports.getRecipeTree = (startItemName, quantity) => {
  let tree = getRecipe(startItemName, quantity);
  tree.quantity = quantity;
  let current = tree;
  let stack = [];

  //while current or stack exists
  while (current || stack.length > 0) {
    if (current && current.ingredients) {
      current.ingredients = current.ingredients.map((e) => {
        // console.log(e);
        // console.log(recipe);
        let item = getRecipe(e.name, e.quantity);
        // console.log(item);
        if (item) {
          item.quantity = e.quantity;
          return item;
        } else {
          return e;
        }
      });
      //console.log(current);

      stack.push(...current.ingredients);
    }

    current = stack.pop();
  }

  return tree;
}

// exports.naryTreeTraversal = (
//   startItemName,
//   startQuantity
// ) => {
//   let tree = getRecipeTree(startItemName, startQuantity);
//   const startLevel = 0;

//   let result = [];

//   let currentNode = {
//     data: { ...tree },
//     level: startLevel,
//   };
//   let stack = [];

//   while (currentNode) {
//     console.log(
//       `${"     ".repeat(currentNode.level)}${currentNode.data.name} x${
//         currentNode.data.quantity
//       }`
//     );

//     result.push({
//       level: currentNode.level,
//       name: currentNode.data.name,
//       quantity: currentNode.data.quantity,
//     });

//     if (currentNode.data.ingredients) {
//       currentNode.data.ingredients.forEach((element) => {
//         stack.push({ data: element, level: currentNode.level + 1 });
//       });
//     }

//     currentNode = stack.pop();
//   }
//   console.log(result);
//   return [...result];
// }
