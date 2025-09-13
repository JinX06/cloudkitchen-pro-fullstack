const { uniqueCuisineList, uniqueMealTypeList, searchAndScaleRecipes } = require("../../utils/recipeUtils.js");
const { getAvailability } = require("../../utils/availability.js");

// GET /recipes-34076352
function getRecipesPage(req, res) {
  res.render("recipe.html", {
    myRecipe: req.app.locals.recipeDB,
  });
}

// GET /recipes-add-34076352
function getAddRecipePage(req, res) {
  res.render("recipes/recipe-add.html", {
    cuisines: uniqueCuisineList(req.app.locals.recipeDB),
  });
}

// GET /recipes-remove-34076352
// Assumes validateRecipeID middleware populates req.selectedRecipe and req.selectedRecipeId
function getRemoveRecipePage(req, res) {
  const recipeDB = req.app.locals.recipeDB;
  res.render("recipes/recipe-remove.html", {
    myRecipe: recipeDB,
    selectedRecipe: req.selectedRecipe || null,
    selectedRecipeId: req.selectedRecipeId,
  });
}

// GET /recipes-view-34076352
function getRecipeView(req, res) {
  const recipeDB = req.app.locals.recipeDB;
  const { recipeID } = req.query;
  let selected = null;

  if (recipeID === "RANDOM") {
    const randomIndex = Math.floor(Math.random() * recipeDB.length);
    selected = recipeDB[randomIndex];
  } else if (recipeID) {
    selected = recipeDB.find((recipe) => recipe.recipeID === recipeID);
  }

  res.render("recipes/recipe-view.html", {
    selectedRecipe: selected,
  });
}

// GET /recipes-filter-34076352
function getFilterPage(req, res) {
  const { mealType, cuisineType, difficulty } = req.query;
  const recipeDB = req.app.locals.recipeDB;
  let filteredRecipes = recipeDB;

  if (mealType) {
    filteredRecipes = filteredRecipes.filter(
      (recipe) => recipe.mealType && recipe.mealType.toLowerCase().includes(mealType.toLowerCase())
    );
  }

  if (cuisineType) {
    filteredRecipes = filteredRecipes.filter(
      (recipe) => recipe.cuisineType && recipe.cuisineType.toLowerCase().includes(cuisineType.toLowerCase())
    );
  }

  if (difficulty) {
    filteredRecipes = filteredRecipes.filter(
      (recipe) => recipe.difficulty && recipe.difficulty.toLowerCase().includes(difficulty.toLowerCase())
    );
  }

  res.render("recipe-filter.html", {
    filteredRecipes,
    uniqueCuisines: uniqueCuisineList(recipeDB),
    uniqueMealTypes: uniqueMealTypeList(recipeDB),
    mealType,
    cuisineType,
    difficulty,
  });
}

// GET /recipes-suggestions-34076352
function getSuggestionsPage(req, res) {
  res.render("recipes/recipe-suggestion.html", {
    myRecipe: req.app.locals.recipeDB,
    uniqueCuisines: uniqueCuisineList(req.app.locals.recipeDB),
    uniqueMealTypes: uniqueMealTypeList(req.app.locals.recipeDB),
  });
}

// GET /recipes-suggestion-results-34076352
function getSuggestionResults(req, res) {
  let results = req.app.locals.suggestedRecipes;
  results = results.slice(0, 3);
  res.render("recipes/recipe-suggestion-results.html", { suggestions: results });
}

// GET /recipes-search-scale-34076352
function getSearchScale(req, res) {
  const searchQuery = (req.query.search || "").trim();
  let scaleFactor = parseFloat(req.query.scaleFactor) || 1;
  scaleFactor = Math.max(1, Math.min(scaleFactor, 10));

  const searchResults = searchAndScaleRecipes(req.app.locals.recipeDB, searchQuery, scaleFactor);

  res.render("recipe-search-scale.html", {
    searchQuery,
    scaleFactor,
    searchResults,
  });
}

// GET /recipes-availability-34076352
function getAvailabilityPage(req, res) {
  const recipeDB = req.app.locals.recipeDB;
  const inventory = req.app.locals.inventoryItemDB;

  const rows = [];
  for (let i = 0; i < recipeDB.length; i++) {
    const recipe = recipeDB[i];
    rows.push({
      recipe: recipe,
      availability: getAvailability(recipe, inventory),
    });
  }

  rows.sort((recipeA, recipeB) => {
    return recipeB.availability.percent - recipeA.availability.percent;
  });

  res.render("recipe-availability.html", {
    rows,
  });
}

module.exports = {
  getRecipesPage,
  getAddRecipePage,
  getRemoveRecipePage,
  getRecipeView,
  getFilterPage,
  getSuggestionsPage,
  getSuggestionResults,
  getSearchScale,
  getAvailabilityPage,
};

