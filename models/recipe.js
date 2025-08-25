class Recipe {

    static recipeID = 1;
    constructor(title, chef, ingredients, instructions, mealType, cuisineType, prepTime, difficulty, servings) {

        // increment the static counter, then format with zero-padding to 5 digits (e.g. R-00001)
        this.recipeID = `R-${String(Recipe.recipeID).padStart(5, "0")}`;
        Recipe.recipeID++;

        this.title = title;
        this.chef = chef
        this.ingredients = ingredients;
        this.instructions = instructions
        this.mealType = mealType;
        this.cuisineType = cuisineType;
        this.prepTime = prepTime;
        this.difficulty = difficulty;
        this.servings = servings;

        this.dateObj = new Date(); // Format: "YYYY-MM-DDTHH:mm:ss.sssZ"
        this.createdDate = this.dateObj.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    }
}

module.exports = { Recipe };