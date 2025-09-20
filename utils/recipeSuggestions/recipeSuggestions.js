const { buildRecipeBuckets } = require("./recipeBuckets.js");
const { buildUserBuckets } = require("./userBuckets.js");

function getRecipeSuggestions(userResponse, recipesInput) {
    const user = buildUserBuckets(userResponse);
    let recipes = [];
    if (Array.isArray(recipesInput)) {
        recipes = JSON.parse(JSON.stringify(recipesInput));
    }

    for (const recipe of recipes) {
        let totalScore = 0;
        const recipeBuckets = buildRecipeBuckets(recipe);

        // Cuisine
        if (recipe.cuisineType === userResponse.cuisineType) {
            totalScore += 30;
        }

        // Meal type
        if (recipe.mealType === userResponse.mealType) {
            totalScore += 10;
        }

        // Prep time bucket (with adjacent/difference of 1 be considered)
        const prepDiff = Math.abs(recipeBuckets.prepBucket - user.prepBucket);
        if (prepDiff === 0) {
            totalScore += 20;
        } else if (prepDiff === 1) {
            totalScore += 12;
        }

        // Difficulty (string equality only)
        if (recipe.difficulty === userResponse.difficulty) {
            totalScore += 15;
        }

        // Ingredient bucket (with adjacent/difference of 1 be considered)
        const ingDiff = Math.abs(recipeBuckets.ingredientBucket - user.ingredientBucket);
        if (ingDiff === 0) {
            totalScore += 15;
        } else if (ingDiff === 1) {
            totalScore += 8;
        }

        // Step bucket (with adjacent/difference of 1 be considered)
        const stepDiff = Math.abs(recipeBuckets.stepBucket - user.stepBucket);
        if (stepDiff === 0) {
            totalScore += 10;
        } else if (stepDiff === 1) {
            totalScore += 5;
        }

        recipe.weight = totalScore;
    }

    //Learn from: https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
    recipes.sort(function(recipe1, recipe2) {
        return (recipe2.weight) - (recipe1.weight); //sorts by descending weight
    });
    return recipes;
}

module.exports = { getRecipeSuggestions }
