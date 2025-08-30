const {
assert, assertString, assertArray, assertNonNegativeNumber, assertPositiveInt, assertEnum, validateIngredientEntry, trimStringsInArray, assertNonNumericString
} = require("./validate");

class Recipe {

    static recipeID = 1;
    constructor(title, chef, ingredients, instructions, mealType, cuisineType, prepTime, difficulty, servings) {

        // increment the static counter, then format with zero-padding to 5 digits (e.g. R-00001)
        this.recipeID = `R-${String(Recipe.recipeID).padStart(5, "0")}`;
        Recipe.recipeID++;


        this.title = assertNonNumericString(title, "Title");
        this.chef = assertNonNumericString(chef, "Chef");

        // Validate ingredients array
        assert(ingredients, "Ingredients");
        const cleanedIngredients = [];

        // Ignore empty ingredients/empty elements in list [1,2,"",3] = [1,2,3])
        for (let i = 0; i < ingredients.length; i++) {
            if (ingredients[i].trim().length !== 0){
                cleanedIngredients.push(validateIngredientEntry(ingredients[i], i, "ingredients"));
            }
        }
        this.ingredients = cleanedIngredients; // strings or { name, quantity }

        assertArray(instructions, "instructions");
        this.instructions = trimStringsInArray(instructions, "instructions");

        this.mealType = assertNonNumericString(mealType, "Meal Type");
        this.cuisineType = assertNonNumericString(cuisineType, "Cuisine Type");
        this.prepTime = assertPositiveInt(prepTime, "Prep Time");
        this.difficulty = assertEnum(difficulty, ["Easy", "Medium", "Hard"], "Difficulty");
        this.servings = assertPositiveInt(servings, "Servings");

        this.dateObj = new Date(); // Format: "YYYY-MM-DDTHH:mm:ss.sssZ"

        this.createdDate = this.dateObj.toISOString().split("T")[0]; // Format: YYYY-MM-DD

        this.weight = 0; //Used for HD++ tasks for recipe suggestions

    }
}

module.exports = { Recipe };