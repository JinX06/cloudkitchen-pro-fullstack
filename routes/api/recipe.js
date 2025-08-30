const { Recipe } = require("../../models/recipe");
const express = require("express")
const router = express.Router();
const { getRecipeSuggestions } = require("../../utils/recipeSuggestions/recipeSuggestions.js");

router.post("/api/recipes/add-34076352", (req, res) => {
    const {title, chef, mealType, cuisine1, cuisine2, prepTime, difficulty, servings,ingredients, instructions} = req.body;

    //   Handle the cuisine selection (existing/new)
    let finalCuisine = "";
    if (cuisine2) {
        finalCuisine = cuisine2.trim();
    } else if (cuisine1) {
        finalCuisine = cuisine1.trim();
    }

    let ingredientsArr;
    if (Array.isArray(ingredients)) {
        ingredientsArr = ingredients;
    } else {
        const ing = ingredients || "";
        ingredientsArr = ing.split(/\r?\n|,/);
    }

    let instructionsArr;
    if (Array.isArray(instructions)) {
        instructionsArr = instructions;
    } else {
        const instruction = instructions || "";
        instructionsArr = instruction.split(/\r?\n|,/)
    }

    try {
        // Pass the validation to Recipe’s constructor.
        const recipe = new Recipe(
            title,
            chef,
            ingredientsArr,
            instructionsArr,
            mealType,
            finalCuisine,
            Number(prepTime),
            difficulty,
            Number(servings)
        );

        req.app.locals.recipeDB.push(recipe);
        return res.redirect("/recipes-34076352");

    } catch (err) {

        req.app.locals.errorOBJ = err;

        res.redirect("/error-34076352");

        // return res.send(`${JSON.stringify(req.body)} <br> ${err.message}`);

    }
});

router.post("/api/recipes/delete-34076352", (req, res) => {
    const { recipeID } = req.query;
    const list = req.app.locals.recipeDB;
    const index = list.findIndex(recipe => recipe.recipeID === recipeID);

    if (index !== -1) {
        list.splice(index, 1);
        return res.redirect("/recipes-34076352");
    } else {
        req.app.locals.errorOBJ = { status: 400, message: "Recipe not found." };
        return res.redirect("/error-34076352");
    }
});

router.post("/api/recipes-suggestions-34076352", (req, res) => {
  const userResponse = {
    cuisineType: req.body.cuisineType,
    prepBucket: req.body.prepBucket, // "0-5" | "6-15" | ...
    difficulty: req.body.difficulty, // "Easy" | "Medium" | "Hard"
    ingBucket: req.body.ingBucket, // "1-3" | "4-6" | ...
    stepBucket: req.body.stepBucket, // "1-3" | "4-6" | ...
    mealType: req.body.mealType, // "Breakfast" | "Lunch" | "Dinner" | ...
  };

  req.app.locals.suggestedRecipes = getRecipeSuggestions(userResponse);


  res.redirect("/recipe-suggestion-results-34076352");
//   res.send(req.app.locals.suggestedRecipes);
});

// Add a review/rating to a recipe and recompute its average rating
router.post("/api/recipes/add-review-34076352", (req, res) => {
    const { recipeID, reviewer, rating, comment } = req.body;
    const list = req.app.locals.recipeDB;
    const recipe = list.find(recipe => recipe.recipeID === recipeID);

    if (!recipe) {
        req.app.locals.errorOBJ = { status: 400, message: "Recipe not found." };
        return res.redirect("/error-34076352");
    }

    const numericRating = Number(rating);
    if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
        req.app.locals.errorOBJ = { status: 400, message: "Invalid rating. Rating must be within 1-5." };
        return res.redirect("/error-34076352");
    }

    recipe.ratings.push(numericRating);
    recipe.reviews.push({
        reviewer: (reviewer || "Anonymous").trim(), //either use provided reviewer name or default to "Anonymous"
        rating: numericRating,
        comment: (comment || "").trim(), //either use provided comment or default to empty string
        date: new Date().toISOString().split("T")[0]
    });

    recipe.recalcAverageRating();

    return res.redirect("/recipes-34076352");
});

module.exports = router;


