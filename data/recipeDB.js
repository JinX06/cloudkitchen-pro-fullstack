const { Recipe } = require("../models/recipe");

const myRecipe = new Recipe(
    "Classic Spaghetti Carbonara",
    "OngJinXiang-34076352",
    ["400g spaghetti", "200g pancetta", "4 large eggs", "100g Pecorino Romano", "Black pepper"],
    ["Boil salted water for pasta", "Cook pancetta until crispy", "Whisk eggs with cheese", "Combine hot pasta with pancetta", "Add egg mixture off heat"],
    "Dinner",
    "Italian",
    25,
    "Medium",
    4,
);
    
const myRecipe2 = new Recipe(
    "Avocado Toast Supreme",
    "OngJinXiang-34076352",
    ["2 slices sourdough bread", "1 ripe avocado", "1 tomato", "Feta cheese", "Olive oil", "Lemon juice"],
    ["Toast bread until golden", "Mash avocado with lemon", "Slice tomato", "Spread avocado on toast", "Top with tomato and feta"],
    "Breakfast",
    "Mediterranean",
    10,
    "Easy",
    2,
);

const recipeDB = [
    myRecipe,
    myRecipe2
];

module.exports = { recipeDB };