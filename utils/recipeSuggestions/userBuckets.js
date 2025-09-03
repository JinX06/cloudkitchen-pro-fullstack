function buildUserBuckets(userResponse) {
    return {
        prepBucket: mapPrepBucket(userResponse.prepBucket),
        ingredientBucket: mapIngredientBucket(userResponse.ingBucket),
        stepBucket: mapStepBucket(userResponse.stepBucket)
    };
}

// prepBucket (0-5, 6-15, 16-30, 31-60, 61+ -> 1..5)
function mapPrepBucket(value) {
    if (value === "0-5") {
        return 1;
    }
    else if (value === "6-15") {
        return 2;
    }
    else if (value === "16-30") {
        return 3;
    }
    else if (value === "31-60") {
        return 4;
    }
    else {
        return 5; // "61+"
    }
}

// ingredientBucket (1-3, 4-6, 7-10, 11+ -> 1..4)
function mapIngredientBucket(value) {
    if (value === "1-3") {
        return 1;
    }
    else if (value === "4-6") {
        return 2;
    }
    else if (value === "7-10") {
        return 3;
    }
    else {
        return 4; // "11+"
    }
}

// stepBucket (1-3, 4-6, 7-10, 11+ -> 1..4)
function mapStepBucket(value) {
    if (value === "1-3") {
        return 1;
    }
    else if (value === "4-6") {
        return 2;
    }
    else if (value === "7-10") {
        return 3;
    }
    else {
        return 4; // "11+"
    }
}

module.exports = { buildUserBuckets };

