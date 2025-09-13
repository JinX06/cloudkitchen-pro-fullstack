const { Recipe } = require("../../models/recipe");
const { getRecipeSuggestions } = require("../../utils/recipeSuggestions/recipeSuggestions.js");

// POST /api/recipes/add-34076352
function addRecipe(req, res) {
  const { title, chef, ingredients, instructions, mealType, cuisineType, prepTime, difficulty, servings } = req.validated;
  const recipe = new Recipe(title, chef, ingredients, instructions, mealType, cuisineType, prepTime, difficulty, servings);
  req.app.locals.recipeDB.push(recipe);
  return res.redirect("/recipes-34076352");
}

// POST /api/recipes/delete-34076352
function deleteRecipe(req, res) {
  const list = req.app.locals.recipeDB;
  list.splice(req.recipeIndex, 1);
  return res.redirect("/recipes-34076352");
}

// POST /api/recipes-suggestions-34076352
function postRecipeSuggestions(req, res) {
  const userResponse = {
    cuisineType: req.body.cuisineType,
    prepBucket: req.body.prepBucket,
    difficulty: req.body.difficulty,
    ingBucket: req.body.ingBucket,
    stepBucket: req.body.stepBucket,
    mealType: req.body.mealType,
  };

  req.app.locals.suggestedRecipes = getRecipeSuggestions(userResponse);
  res.redirect("/recipes-suggestion-results-34076352");
}

// POST /api/recipes/add-review-34076352
function addReview(req, res, next) {
  const { recipeID, reviewer, rating, comment } = req.validated;
  const list = req.app.locals.recipeDB;
  const recipe = list.find((recipe) => recipe.recipeID === recipeID);

  if (!recipe) {
    const err = new Error("Recipe not found.");
    err.status = 400;
    return next(err);
  }

  recipe.ratings.push(rating);
  recipe.reviews.push({
    reviewer,
    rating,
    comment,
    date: new Date().toISOString().split("T")[0],
  });

  recipe.recalcAverageRating();

  return res.redirect("/recipes-34076352");
}

module.exports = {
  addRecipe,
  deleteRecipe,
  postRecipeSuggestions,
  addReview,
};

