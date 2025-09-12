const { Recipe } = require("../../models/recipe");
const express = require("express")
const router = express.Router();
const { getRecipeSuggestions } = require("../../utils/recipeSuggestions/recipeSuggestions.js");
const { validateRecipeReqBody, validateReviewReqBody } = require("../../middleware/validation/recipeValidation");
const { validateRecipeIDQuery } = require("../../middleware/validation/idValidation.js");

router.post("/api/recipes/add-34076352", validateRecipeReqBody, (req, res) => {
        // Use validated data from middleware
        const { title, chef, ingredients, instructions,mealType, cuisineType, prepTime, difficulty, servings } = req.validated;
        
        // Create the recipe using validated data
        const recipe = new Recipe(title,chef, ingredients,instructions,mealType,cuisineType,prepTime,difficulty,servings);

        req.app.locals.recipeDB.push(recipe);
        return res.redirect("/recipes-34076352");
});

router.post("/api/recipes/delete-34076352", validateRecipeIDQuery, (req, res) => {
    const list = req.app.locals.recipeDB;
    list.splice(req.recipeIndex, 1);
    return res.redirect("/recipes-34076352");
});

router.post("/api/recipes-suggestions-34076352", (req, res) => {
  const userResponse = {
    cuisineType: req.body.cuisineType,
    prepBucket: req.body.prepBucket, // "0-5" | "6-15" | ...
    difficulty: req.body.difficulty, // "Easy" | "Medium" | "Hard"
    ingBucket: req.body.ingBucket, // "1-3" | "4-6" | ...
    stepBucket: req.body.stepBucket, // "1-3" | "4-6" | ...
    mealType: req.body.mealType, // "Breakfast" | "Lunch" | "Dinner"
  };

  req.app.locals.suggestedRecipes = getRecipeSuggestions(userResponse);
  res.redirect("/recipes-suggestion-results-34076352");
});

// Add a review/rating to a recipe and recompute its average rating
router.post("/api/recipes/add-review-34076352", validateReviewReqBody, (req, res, next) => {
    const { recipeID, reviewer, rating, comment } = req.validated;
    const list = req.app.locals.recipeDB;
    const recipe = list.find(recipe => recipe.recipeID === recipeID);

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
        date: new Date().toISOString().split("T")[0]
    });

    recipe.recalcAverageRating();

    return res.redirect("/recipes-34076352");
});

module.exports = router;
