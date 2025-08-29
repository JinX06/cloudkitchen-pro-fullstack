const { uniqueCuisineList, uniqueMealTypeList } = require("../recipeUtils.js");
    // constructor(title, chef, ingredients, instructions, mealType, cuisineType, prepTime, difficulty, servings) {

function calculateRecipeWeights(recipeDB) {
    for (const recipe of recipeDB) {
        processIngredientsWeights(recipe); // Add the weights for respective ingredients's length
        processInstructionsWeights(recipe); // Add the weights for respective instructions's length
        processPrepTimeWeights(recipe); // Add the weights for respective preparation time
        processDifficultyWeights(recipe); // Add the weights for respective difficulty
        processServingWeights(recipe); // Add the weights for respective servings
    }
}

function processIngredientsWeights(recipe) {
        if(recipe.ingredients.length <= 5){
            recipe.weight += 0;
        } if(recipe.ingredients.length > 5 && recipe.ingredients.length <= 10){
            recipe.weight += 1;
        } if(recipe.ingredients.length > 10){
            recipe.weight += 2;
        }
}

function processInstructionsWeights(recipe) {
    if(recipe.instructions.length <= 3){
        recipe.weight += 0;
    } if(recipe.instructions.length >= 4 && recipe.instructions.length <= 6){
        recipe.weight += 1;
    } if(recipe.instructions.length > 6 && recipe.instructions.length <= 10){
        recipe.weight += 2;
    } if(recipe.instructions.length > 10){
        recipe.weight += 3;
    }
}

function processPrepTimeWeights(recipe) {
    if(recipe.prepTime <= 5){
        recipe.weight += 0;
    } if(recipe.prepTime >= 6 && recipe.prepTime <= 15){
        recipe.weight += 1;
    } if(recipe.prepTime >= 16 && recipe.prepTime <= 30){
        recipe.weight += 2;
    } if(recipe.prepTime >= 31 && recipe.prepTime <= 60){
        recipe.weight += 3;
    } if(recipe.prepTime > 60){
        recipe.weight += 4;
    }
}


function processDifficultyWeights(recipe) {
    if(recipe.difficulty === "Easy"){
        recipe.weight += 1;
    } if(recipe.difficulty === "Medium"){
        recipe.weight += 2;
    } if(recipe.difficulty === "Hard"){
        recipe.weight += 3;
    }
}

function processServingWeights(recipe){
    if(recipe.servings === 1){
        recipe.weight += 1;
    } if(recipe.servings >= 2 && recipe.servings <= 3){
        recipe.weight += 2;
    } if(recipe.servings >= 4 && recipe.servings <= 6){
        recipe.weight += 3;
    } if(recipe.servings > 6){
        recipe.weight += 4;
    }
}

module.exports = { calculateRecipeWeights }