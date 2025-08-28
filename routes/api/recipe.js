const { Recipe } = require("../../models/recipe");
const express = require("express")
const router = express.Router();

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

module.exports = router;
