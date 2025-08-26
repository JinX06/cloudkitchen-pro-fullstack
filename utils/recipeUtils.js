function uniqueCuisineList(recipes) {
  const set = new Set();
  for (const recipe of recipes) {
    set.add(recipe.cuisineType);
  }
  return Array.from(set);
}

module.exports = { uniqueCuisineList };