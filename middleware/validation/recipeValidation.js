const {
    assert,
    assertNonNumericString,
    assertPositiveInt,
    assertEnum,
} = require("../../models/validate");

/**
 * Middleware to validate recipe 
 */
const validateRecipeReqBody = (req, res, next) => {
    try {
        const { title, chef, mealType, cuisine1, cuisine2, prepTime, difficulty, servings, ingredients, instructions } = req.body;

        const validatedTitle = assertNonNumericString(title, "Title");
        const validatedChef = assertNonNumericString(chef, "Chef");
        const validatedMealType = assertNonNumericString(mealType, "Meal Type");
        
        // Handle cuisine selection (either cuisine1 (select from existing) or cuisine2 (create new))
        let finalCuisine = "";
        if (cuisine2) {
            finalCuisine = assertNonNumericString(cuisine2.trim(), "Cuisine Type");
        } else if (cuisine1) {
            finalCuisine = assertNonNumericString(cuisine1.trim(), "Cuisine Type");
        } else {
            throw new Error("Cuisine Type is required");
        }

        const validatedPrepTime = assertPositiveInt(Number(prepTime), "Prep Time");
        const validatedServings = assertPositiveInt(Number(servings), "Servings");
        
        const validatedDifficulty = assertEnum(difficulty, ["Easy", "Medium", "Hard"], "Difficulty");

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
        
        // Ignore empty instructions/empty elements in list
        let cleanedInstructions = [];
        for (let i = 0; i < instructionsArr.length; i++) {
            if (instructionsArr[i].trim().length !== 0){
                cleanedInstructions.push(instructionsArr[i].trim());
            }
        }

        let cleanedIngredients = [];
        for (let i = 0; i < ingredientsArr.length; i++) {
            if (ingredientsArr[i].trim().length !== 0) {
                cleanedIngredients.push(ingredientsArr[i].trim());
            }
        }

        // Store validated data
        req.validated = {
            title: validatedTitle,
            chef: validatedChef,
            mealType: validatedMealType,
            cuisineType: finalCuisine,
            prepTime: validatedPrepTime,
            servings: validatedServings,
            difficulty: validatedDifficulty,
            ingredients: cleanedIngredients,
            instructions: cleanedInstructions
        };

        next();
    } catch (err) {
        req.app.locals.errorOBJ = {
            status: 400,
            message: err.message
        };
        return res.redirect("/error-34076352");
    }
};

/**
 * Middleware to validate recipe review payload
 */
const validateReviewReqBody = (req, res, next) => {
    try {
        const { recipeID, reviewer, rating, comment } = req.body;
        
        // Validate rating
        const numericRating = Number(rating);
        assert(!isNaN(numericRating) && numericRating >= 1 && numericRating <= 5, // prevent user devtools manipulation
            "Rating must be a number between 1 and 5");
        
        // Store validated data
        req.validated = {
            recipeID,
            reviewer: (reviewer || "Anonymous").trim(), // use Anonymous if reviewer is not provided
            rating: numericRating,
            comment: (comment || "").trim()  //leave comment as empty string if not provided
        };
        
        next();
        
    } catch (err) {
        req.app.locals.errorOBJ = {
            status: 400,
            message: err.message
        };
        return res.redirect("/error-34076352");
    }
};

module.exports = {
    validateRecipeReqBody,
    validateReviewReqBody
};
