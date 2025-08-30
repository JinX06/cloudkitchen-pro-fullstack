function buildRecipeBuckets(recipe) {
return {
        prepBucket: mapPrepBucket(recipe.prepTime),
        ingredientBucket: mapIngredientBucket(recipe.ingredients.length),
        stepBucket: mapStepBucket(recipe.instructions.length)
    };
}

// prepBucket (0-5, 6-15, 16-30, 31-60, 61+ -> 1..5)
function mapPrepBucket(value) {
    if (value <= 5) {
        return 1;
    } else if (value <= 15) {
        return 2;
    } else if (value <= 30) {
        return 3;
    } else if (value <= 60) {
        return 4;
    } else {
        return 5;
    }
}

// ingredientBucket (1-3, 4-6, 7-10, 11+ -> 1..4)
function mapIngredientBucket(value) {
    if (value <= 3) {
        return 1;
    } else if (value <= 6) {
        return 2;
    } else if (value <= 10) {
        return 3;
    } else {
        return 4;
    }
}

// stepBucket (1-3, 4-6, 7-10, 11+ -> 1..4)
function mapStepBucket(value) {
    if (value <= 3) {
        return 1;
    } else if (value <= 6) {
        return 2;
    } else if (value <= 10) {
        return 3;
    } else {
        return 4;
    }
}

module.exports = { buildRecipeBuckets };