const express = require("express")
const router = express.Router();
const { uniqueCuisineList } = require("../../utils/recipeUtils.js");

router.get("/recipes-34076352", (req, res) => {
    res.render("recipes.html", {
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

module.exports = router;


