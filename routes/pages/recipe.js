const express = require("express")
const router = express.Router();
const { uniqueCuisineList, uniqueMealTypeList } = require("../../utils/recipeUtils.js");

router.get("/recipes-34076352", (req, res) => {
    res.render("recipe.html", {
        myRecipe: req.app.locals.recipeDB
    });
});

router.get("/recipes-add-34076352", (req, res) => {
    res.render("recipes/recipe-add.html", {
        cuisines: uniqueCuisineList(req.app.locals.recipeDB)
    });
});

router.get("/recipes-remove-34076352", (req, res) => {
    const recipeDB = req.app.locals.recipeDB;
    const { recipeID } = req.query;
    let selected = null;

    if (recipeID) {
        selected = recipeDB.find(recipe => recipe.recipeID === recipeID) || null;
    }

    res.render("recipes/recipe-remove.html", {
        myRecipe: recipeDB,
        selectedRecipe: selected ? selected.getJSON() : null,
        selectedRecipeId: recipeID
    });
});


router.get("/recipes-view-34076352", (req, res) => {
    const recipeDB = req.app.locals.recipeDB;
    const { recipeID } = req.query;
    let selected = null;

    if (recipeID === "RANDOM") {
        randomIndex = Math.floor(Math.random() * recipeDB.length);
        selected = recipeDB[randomIndex] || null;
    } else if (recipeID) {
        selected = recipeDB.find(recipe => recipe.recipeID === recipeID) || null;
    }

    res.render("recipes/recipe-view.html", {
        selectedRecipe: selected ? selected.getJSON() : null
    });
});

router.get("/recipes-filter-34076352", (req, res) => {
    const { mealType, cuisineType, difficulty } = req.query;

    const recipeDB = req.app.locals.recipeDB;
    let filteredRecipes = recipeDB;

    // Filter by mealType (case-insensitive)
    if (mealType) {
        filteredRecipes = filteredRecipes.filter(recipe => 
            recipe.mealType && recipe.mealType.toLowerCase().includes(mealType.toLowerCase())
        );
    }

    // Filter by cuisineType (case-insensitive)
    if (cuisineType) {
        filteredRecipes = filteredRecipes.filter(recipe => 
            recipe.cuisineType && recipe.cuisineType.toLowerCase().includes(cuisineType.toLowerCase())
        );
    }

    // Filter by difficulty (case-insensitive)
    if (difficulty) {
        filteredRecipes = filteredRecipes.filter(recipe => 
            recipe.difficulty && recipe.difficulty.toLowerCase().includes(difficulty.toLowerCase())
        );
    }

    // Get unique lists for options
    res.render("recipe-filter.html", {
        filteredRecipes,
        uniqueCuisines: uniqueCuisineList(recipeDB),
        uniqueMealTypes: uniqueMealTypeList(recipeDB),
        mealType,
        cuisineType,
        difficulty
    });
});

router.get("/recipes-suggestions-34076352", (req,res) =>{
    res.render("recipes/recipe-suggestion.html", {
        myRecipe: req.app.locals.recipeDB,
        uniqueCuisines: uniqueCuisineList(req.app.locals.recipeDB),
        uniqueMealTypes: uniqueMealTypeList(req.app.locals.recipeDB),
    });
});

router.get("/recipes/recipe-suggestion-results-34076352.html", (req, res) => {
    let results = req.app.locals.suggestedRecipes;
    results = results.slice(0, 3);
    let r1 = results[0]
    console.log(r1)

    res.render("recipes/recipe-suggestion-results.html", { suggestions: results });
});

module.exports = router;


