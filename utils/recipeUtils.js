function uniqueCuisineList(recipes) {
  const set = new Set();
  for (const recipe of recipes) {
    set.add(recipe.cuisineType);
  }
  return Array.from(set);
}

function uniqueMealTypeList(recipes) {
  const set = new Set();
  for (const recipe of recipes) {
    set.add(recipe.mealType);
  }
  return Array.from(set);
}

// Core logic extracted from the search-scale route
function searchAndScaleRecipes(recipes, searchQuery, scaleFactor) {
  //"Deep copy" Learnt from:
  // https://developer.mozilla.org/en-US/docs/Glossary/Deep_copy
  const duplicatedDB = JSON.parse(JSON.stringify(recipes));

  function scaleIngredientLine(ingredient, factor) {
    if (typeof ingredient !== "string" || ingredient.trim() === "") {
      return ingredient;
    }

    let text = ingredient.trim();

    // regex learnt from: https://stackoverflow.com/questions/27593185/regular-expression-for-numbers-and-units

    // Case 1: quantity sticking to unit
    // Example: "200g pancetta"
    const mergedIngredient = text.match(/^(\d+(?:\.\d+)?)([a-zA-Z]+)(.*)$/);
    // (\d+(?:\.\d+)?) = 200
    // ([a-zA-Z]+) = g
    // (.*) = pancetta

    if (mergedIngredient) {
      const [, qtyStr, unit, item] = mergedIngredient;     // [200g pancetta, 200, g, pancetta]
      const scaled = parseFloat(qtyStr) * factor;
      return `${scaled}${unit}${item}`;
    }

    // Case 2: quantity + space+ text/item
    // Example: "200 g pancetta" or "8 large eggs"
    const spaceIngredient = text.match(/^(\d+(?:\.\d+)?)(\s+)(.*)$/);
    // (\d+(?:\.\d+)?) = 200    |   8
    // (\s+) = " "              |   " "
    // (.*) = g pancetta        |   large eggs
    if (spaceIngredient) {
      const [, qtyStr, space, item] = spaceIngredient;     // [200 g pancetta, 200,  , g pancetta]
      const scaled = parseFloat(qtyStr) * factor;
      return `${scaled}${space}${item}`;
    }

    return ingredient; // No leading number -> leave unchanged
  }

  function scaleServings(servings, factor) {
    const servingsFloat = parseFloat(servings);

    // Prevent text serving size being parsed as a number ("two"/"") to prevent NaN errors
    if (Number.isNaN(servingsFloat)) {
      return servings;
    }

    const scaled = servingsFloat * factor;
    if (Number.isInteger(scaled)) {
      return scaled;
    } else {
      return Math.round(scaled * 100) / 100;
    }
  }

  function matchesQuery(recipe, query) {
    if (!query) {
      return true; // empty query = true = include all
    }

    const queryLower = query.toLowerCase();

    const fields = [
      recipe.name,
      recipe.title,
      recipe.recipeName,
      recipe.cuisineType,
      recipe.mealType,
      recipe.difficulty,
      recipe.description
    ]

    for (const field of fields) {
      if (typeof field === "string" && field.toLowerCase().includes(queryLower)) {
        return true;
      }
    }

    if (Array.isArray(recipe.ingredients)) {
      for (const ingredient of recipe.ingredients) {
        if (String(ingredient).toLowerCase().includes(queryLower)) {
          return true;
        }
      }
    }

    return false;
  }

  // Filter the spliced list and perform scaling mutatively on those items.
  const filtered = duplicatedDB.filter(recipe => matchesQuery(recipe, searchQuery));

  filtered.forEach(recipe => {
    if (Array.isArray(recipe.ingredients)) {
      recipe.ingredients = recipe.ingredients.map(ingredient => scaleIngredientLine(ingredient, scaleFactor));
    }

    if (recipe.servings !== undefined) {
      recipe.servings = scaleServings(recipe.servings, scaleFactor);
    }
  });

  return filtered;
}

module.exports = { uniqueCuisineList, uniqueMealTypeList, searchAndScaleRecipes };