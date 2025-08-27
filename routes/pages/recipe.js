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




module.exports = router;


