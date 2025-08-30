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
        selectedRecipe: selected,
        selectedRecipeId: recipeID
    });
});


router.get("/recipes-view-34076352", (req, res) => {
    const recipeDB = req.app.locals.recipeDB;
    const { recipeID } = req.query;
    let selected = null;

    if (recipeID === "RANDOM") {
        randomIndex = Math.floor(Math.random() * recipeDB.length);
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
    
    
    function scaleIngredientLine(ingredient, factor) {
        if (typeof ingredient !== "string" || ingredient.trim() === "") {
            return ingredient;
        }

        let text = ingredient.trim();

        // regex learnt from: https://stackoverflow.com/questions/27593185/regular-expression-for-numbers-and-units

        // Case 1: quantity sticking to unit
        // Example: "200g pancetta"
        const compact = text.match(/^(\d+(?:\.\d+)?)([a-zA-Z]+)(.*)$/);
        // (\d+(?:\.\d+)?) = 200
        // ([a-zA-Z]+) = g
        // (.*) = pancetta

        if (compact) {
            const [, qtyStr, unit, item] = compact;     // [200g pancetta, 200, g, pancetta]
            const scaled = parseFloat(qtyStr) * factor;
            return `${scaled}${unit}${item}`;
        }

        // Case 2: quantity + space+ text/item
        // Example: "200 g pancetta" or "8 large eggs"
        const spaced = text.match(/^(\d+(?:\.\d+)?)(\s+)(.*)$/);
        // (\d+(?:\.\d+)?) = 200    |   8
        // (\s+) = " "              |   " "
        // (.*) = g pancetta        |   large eggs
        if (spaced) {
            const [, qtyStr, space, item] = spaced;     // [200 g pancetta, 200,  , g pancetta]
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

    //"Deep copy" Learnt from:
    // https://developer.mozilla.org/en-US/docs/Glossary/Deep_copy
    const duplicatedDB = JSON.parse(JSON.stringify(req.app.locals.recipeDB));

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

    const searchResults = filtered;

    res.render("recipe-search-scale.html", {
        searchQuery,
        scaleFactor,
        searchResults
    });
});

module.exports = router;


