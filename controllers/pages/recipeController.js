const { searchAndScaleRecipes } = require("../../utils/recipeUtils.js");
const { getAvailability } = require("../../utils/availability.js");
const Recipe = require("../../models/Recipe");
const Inventory = require("../../models/Inventory");

// GET /recipes-34076352
async function getRecipesPage(req, res, next) {
  try {
    const myRecipe = await Recipe.find({ userId: req.currentUser.userId });
    const otherRecipes = await Recipe.find({ userId: { $ne: req.currentUser.userId } });
    res.render("recipe.html", { myRecipe, otherRecipes });
  } catch (err) { return next(err); }
}

// GET /recipes-add-34076352
async function getAddRecipePage(req, res, next) {
  try {
    const cuisines = ["Italian","Asian","Mexican","American","French","Indian","Mediterranean","Other"];
    res.render("recipes/recipe-add.html", { cuisines, form: {}, error: null });
  } catch (err) { 
    return next(err); 
  }
}

// GET /recipes-edit-34076352
async function getEditRecipePage(req, res, next) {
  try {
    const cuisines = ["Italian","Asian","Mexican","American","French","Indian","Mediterranean","Other"];
    const myRecipe = await Recipe.find({ userId: req.currentUser.userId });
    let selectedRecipe = req.selectedRecipe || null;

    const form = selectedRecipe ? {
      recipeId: selectedRecipe.recipeId,
      title: selectedRecipe.title,
      mealType: selectedRecipe.mealType,
      cuisineType: selectedRecipe.cuisineType,
      prepTime: selectedRecipe.prepTime,
      difficulty: selectedRecipe.difficulty,
      servings: selectedRecipe.servings,
      ingredients: Array.isArray(selectedRecipe.ingredients) ? selectedRecipe.ingredients.join("\n") : "",
      instructions: Array.isArray(selectedRecipe.instructions) ? selectedRecipe.instructions.join("\n") : "",
    } : {};

    let notice;
    if (req.query.notice === "updated") {
      notice = "Recipe updated successfully.";
    } else {
      notice = null;
    }

    res.render("recipes/recipe-edit.html", {
      cuisines,
      myRecipe,
      selectedRecipe,
      selectedRecipeId: req.selectedRecipeId,
      error: null,
      notice,
      form,
    });
  } catch (err) {
    return next(err);
  }
}

// GET /recipes-remove-34076352
async function getRemoveRecipePage(req, res, next) {
  try {
    const myRecipe = await Recipe.find({ userId: req.currentUser.userId });
    res.render("recipes/recipe-remove.html", {
      myRecipe,
      selectedRecipe: req.selectedRecipe || null,
      selectedRecipeId: req.selectedRecipeId,
    });
  } catch (err) { return next(err); }
}

// GET /recipes-view-34076352
async function getRecipeView(req, res, next) {
  try {
    const { recipeID } = req.query;
    let selected = null;
    if (recipeID) {
      selected = await Recipe.findOne({ recipeId: recipeID });
    }
    res.render("recipes/recipe-view.html", { selectedRecipe: selected });
  } catch (err) { return next(err); }
}

// GET /recipes-filter-34076352
async function getFilterPage(req, res, next) {
  try {
    const { mealType, cuisineType, difficulty } = req.query;
    const query = { userId: req.currentUser.userId };

    if (mealType) query.mealType = mealType.trim();
    if (cuisineType) query.cuisineType = cuisineType.trim();
    if (difficulty) query.difficulty = difficulty.trim();
    
    const filteredRecipes = await Recipe.find(query);
    const uniqueCuisines = await Recipe.distinct("cuisineType", { userId: req.currentUser.userId });
    const uniqueMealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];
    
    res.render("recipe-filter.html", {
      filteredRecipes,
      uniqueCuisines,
      uniqueMealTypes,
      mealType,
      cuisineType,
      difficulty,
    });
  } catch (err) { 
    return next(err); 
  }
}

// GET /recipes-suggestions-34076352
async function getSuggestionsPage(req, res, next) {
  try {
    const myRecipe = await Recipe.find({ userId: req.currentUser.userId });

    const uniqueCuisines = await Recipe.distinct("cuisineType", { userId: req.currentUser.userId });

    const uniqueMealTypes = await Recipe.distinct("mealType", { userId: req.currentUser.userId });

    res.render("recipes/recipe-suggestion.html", { myRecipe, uniqueCuisines, uniqueMealTypes });
  } catch (err) { 
    return next(err); 
  }
}

// GET /recipes-suggestion-results-34076352
function getSuggestionResults(req, res) {
  let results = req.app.locals.suggestedRecipes;
  results = results.slice(0, 3);
  res.render("recipes/recipe-suggestion-results.html", { suggestions: results });
}

// GET /recipes-search-scale-34076352
async function getSearchScale(req, res, next) {
  try {
    const searchQuery = (req.query.search || "").trim();

    let scaleFactor = parseFloat(req.query.scaleFactor) || 1;

    scaleFactor = Math.max(1, Math.min(scaleFactor, 10));
    const data = await Recipe.find({ userId: req.currentUser.userId });
    const searchResults = searchAndScaleRecipes(data, searchQuery, scaleFactor);
    res.render("recipe-search-scale.html", { searchQuery, scaleFactor, searchResults });
  } catch (err) { 
    return next(err); 
  }
}

// GET /recipes-availability-34076352
async function getAvailabilityPage(req, res, next) {
  try {
    const recipeDB = await Recipe.find({});
    const inventory = await Inventory.find({});
    const rows = recipeDB.map(r => ({ recipe: r, availability: getAvailability(r, inventory) }));
    rows.sort((a,b) => b.availability.percent - a.availability.percent);
    res.render("recipe-availability.html", { rows });
  } catch (err) { 
    return next(err); 

  }
}

module.exports = {
  getRecipesPage,
  getAddRecipePage,
  getEditRecipePage,
  getRemoveRecipePage,
  getRecipeView,
  getFilterPage,
  getSuggestionsPage,
  getSuggestionResults,
  getSearchScale,
  getAvailabilityPage,
};

