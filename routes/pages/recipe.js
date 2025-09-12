const express = require("express")
const router = express.Router();
const { uniqueCuisineList, uniqueMealTypeList, searchAndScaleRecipes } = require("../../utils/recipeUtils.js");
const { getAvailability } = require("../../utils/availability.js");
const { validateRecipeID } = require("../../middleware/validation/idValidation.js");

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

router.get("/recipes-remove-34076352", validateRecipeID, (req, res) => {
    const recipeDB = req.app.locals.recipeDB;
    res.render("recipes/recipe-remove.html", {
        myRecipe: recipeDB,
        selectedRecipe: req.selectedRecipe || null,
        selectedRecipeId: req.selectedRecipeId
    });
});


router.get("/recipes-view-34076352", (req, res) => {
    const recipeDB = req.app.locals.recipeDB;
    const { recipeID } = req.query;
    let selected = null;

    if (recipeID === "RANDOM") {
        const randomIndex = Math.floor(Math.random() * recipeDB.length);
        selected = recipeDB[randomIndex];
    } else if (recipeID) {
        selected = recipeDB.find(recipe => recipe.recipeID === recipeID);
    }

    res.render("recipes/recipe-view.html", {
        selectedRecipe: selected
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

router.get("/recipes-suggestions-34076352", (req, res) => {
    res.render("recipes/recipe-suggestion.html", {
        myRecipe: req.app.locals.recipeDB,
        uniqueCuisines: uniqueCuisineList(req.app.locals.recipeDB),
        uniqueMealTypes: uniqueMealTypeList(req.app.locals.recipeDB),
    });
});

router.get("/recipes-suggestion-results-34076352", (req, res) => {
    let results = req.app.locals.suggestedRecipes;
    results = results.slice(0, 3);

    res.render("recipes/recipe-suggestion-results.html", { suggestions: results });
});

router.get("/recipes-search-scale-34076352", (req, res) => {

    const searchQuery = (req.query.search || "").trim();
    let scaleFactor = parseFloat(req.query.scaleFactor) || 1;
    scaleFactor = Math.max(1, Math.min(scaleFactor, 10));

    const searchResults = searchAndScaleRecipes(req.app.locals.recipeDB, searchQuery, scaleFactor);

    res.render("recipe-search-scale.html", {
        searchQuery,
        scaleFactor,
        searchResults
    });
});


router.get("/recipes-availability-34076352", (req, res) => {
    const recipeDB = req.app.locals.recipeDB;
    const inventory = req.app.locals.inventoryItemDB;

    // Compute availability for every recipe
    const rows = [];
    for (let i = 0; i < recipeDB.length; i++) {
        const recipe = recipeDB[i];
        rows.push({
            recipe: recipe,
            availability: getAvailability(recipe, inventory)
        });
    }

    // Sort by availability percent (ascending)
    rows.sort((recipeA, recipeB) => {
        return recipeB.availability.percent - recipeA.availability.percent;
    });

    res.render("recipe-availability.html", {
        rows,
    });
});

module.exports = router;
