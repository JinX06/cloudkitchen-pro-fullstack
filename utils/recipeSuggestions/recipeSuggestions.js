const { calculateRecipeWeights } = require("./recipeWeights.js");
const { calculateUserRecipeWeights } = require("./userWeights.js");
const { recipeDB } = require("../../data/recipeDB.js");

const recipeDBCopy = recipeDB.slice();

function getRecipeSuggestions(userResponse){
    // reset all recipe weights
    for (const recipe of recipeDBCopy) {
        recipe.weight = 0;
    }

    calculateRecipeWeights(recipeDBCopy)
    calculateUserRecipeWeights(userResponse, recipeDBCopy)

    suggestedRecipes = []

    for (const recipe of recipeDBCopy) {
        suggestedRecipes.push({
            recipe: recipe, 
        });
    }

    // Get top 3 weighted recipes
    // const top3Recipes = suggestedRecipes.slice(0, 3);

    return recipeDBCopy;
}

module.exports = { getRecipeSuggestions }