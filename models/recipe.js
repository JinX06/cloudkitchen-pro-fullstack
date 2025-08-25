const {
assert, assertString, assertArray, assertNonNegativeNumber, assertPositiveInt, assertEnum, validateIngredientEntry, trimStringsInArray
} = require("./validate");

class Recipe {

    static recipeID = 1;
    constructor(title, chef, ingredients, instructions, mealType, cuisineType, prepTime, difficulty, servings) {

        // increment the static counter, then format with zero-padding to 5 digits (e.g. R-00001)
        this.recipeID = `R-${String(Recipe.recipeID).padStart(5, "0")}`;
        Recipe.recipeID++;


        this.title = assertString(title, "Title");
        this.chef = assertString(chef, "Chef");

        // Validate ingredients array
        assert(ingredients, "Ingredients");
        const cleanedIngredients = [];
        for (let i = 0; i < ingredients.length; i++) {
            cleanedIngredients.push(validateIngredientEntry(ingredients[i], i, "ingredients"));
        }
        this.ingredients = cleanedIngredients; // strings or { name, quantity }

        assertArray(instructions, "instructions");
        this.instructions = trimStringsInArray(instructions, "instructions");

        this.mealType = assertString(mealType, "Meal Type");
        this.cuisineType = assertString(cuisineType, "Cuisine Type");
        this.prepTime = assertNonNegativeNumber(prepTime, "Prep Time");
        this.difficulty = assertEnum(difficulty, ["Easy", "Medium", "Hard"], "Difficulty");
        this.servings = assertPositiveInt(servings, "Servings");

        this.dateObj = new Date(); // Format: "YYYY-MM-DDTHH:mm:ss.sssZ"

        this.createdDate = this.dateObj.toISOString().split("T")[0]; // Format: YYYY-MM-DD

    }

    getJSON() {
        const ret = {
            recipeID: this.recipeID,
            title: this.title,
            chef: this.chef,
            ingredients: this.ingredients,
            instructions: this.instructions,
            mealType: this.mealType,
            cuisineType: this.cuisineType,
            prepTime: this.prepTime,
            difficulty: this.difficulty,
            servings: this.servings,
            createdDate: this.createdDate
        };
        return ret;
    }

    addIngredient(entry) {
        // entry: string OR { name, quantity }
        const index = this.ingredients.length;
        const validated = validateIngredientEntry(entry, index, "ingredients");
        this.ingredients.push(validated);
    }

    addInstruction(step, position = -1) {
        const trimmed = assertString(step, "instruction");
        if (position === -1 || position >= this.instructions.length) {
            // If position not specified, push new instruction to the end
            this.instructions.push(trimmed);
        } else {
            // Insert at given position
            this.instructions.splice(position, 0, trimmed);
        }
    }

    scaleServings(newServings) {
        assertPositiveInt(newServings, "New Servings");
        const scaleFactor = newServings / this.servings;

        const scaled = [];

        for (let i = 0; i < this.ingredients.length; i++) {
            const ingredient = this.ingredients[i];

            let quantityText = "";
            let name = "";

            if (isString(ingredient)) {
                // Entire string is quantity + name combined
                quantityText = ingredient.trim();
            } else {
                // Object: { name, quantity }
                name = ingredient.name;
                quantityText = ingredient.quantity.trim();
            }

            // Split quantity text into number and unit parts
            let numberStr = "";
            let unit = "";

            for (let char of quantityText) {
                if (!isNaN(char) && char !== " ") {
                    numberStr += char;
                } else if (char === ".") {
                    numberStr += "."; // 25"."5
                } else {
                    unit += char; // "grams"
                }
            }

            if (numberStr) {
                const originalNumber = parseFloat(numberStr);
                const scaledNumber = Math.round(originalNumber * scaleFactor * 100) / 100;
                if (isString(ingredient)) {
                    scaled.push(`${scaledNumber}${unit.trim()}`);
                } else {
                    scaled.push({ name, quantity: `${scaledNumber}${unit.trim()}` });
                }
            } else {
                // No unit: leave as-is
                scaled.push(ingredient);
            }
        }

        return scaled;
    }
}

module.exports = { Recipe };