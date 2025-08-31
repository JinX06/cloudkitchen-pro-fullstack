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

// Additional recipes to give better results from suggestions page

// 1–3 ingredients, 1–3 steps, 0–5 min, Easy
const myRecipe3 = new Recipe(
    "Banana Snack",
    "OngJinXiang-34076352",
    ["1 banana", "Peanut butter"],
    ["Peel banana", "Slice and spread peanut butter"],
    "Breakfast",
    "General",
    3,
    "Easy",
    1,
);

// 4–6 ingredients, 4–6 steps, 6–15 min, Medium
const myRecipe4 = new Recipe(
    "Egg Fried Rice",
    "OngJinXiang-34076352",
    ["Cooked rice", "2 Eggs", "Spring onion", "Soy sauce", "Oil"],
    ["Heat oil in pan","Add beaten eggs and scramble in pan","Add rice and stir-fry","Add soy sauce","Mix in chopped spring onion"],
    "Lunch",
    "Chinese",
    12,
    "Medium",
    2,
);

// 7–10 ingredients, 7–10 steps, 16–30 min, Hard
const myRecipe5 = new Recipe(
    "Vegetable Stir Fry",
    "OngJinXiang-34076352",
    ["Broccoli", "Carrot", "Bell pepper", "peas", "Garlic", "Ginger", "Soy sauce", "Sesame oil", "Water"],
    ["Chop all vegetables","Heat oil in wok","Add garlic and ginger","Add vegetables and stir-fry","Mix soy sauce and water","Pour sauce into wok","Stir until thick","Add sesame oil before serving"],
    "Dinner",
    "Asian",
    25,
    "Hard",
    3,
);

// >10 ingredients, >10 steps, 31–60 min, Medium
const myRecipe6 = new Recipe(
    "Lasagna",
    "OngJinXiang-34076352",
    ["Lasagna noodles", "Tomato sauce", "Ricotta cheese", "Mozzarella cheese", "Parmesan cheese", "Spinach", "Zucchini", "Eggplant", "Carrot", "Onion", "Garlic", "Olive oil", "Basil", "Oregano"],
    ["Preheat oven to 180C", "Slice zucchini, eggplant, and carrot", "Chop onion and garlic", "Saute onion and garlic in olive oil", "Add tomato sauce and herbs", "Simmer sauce for 10 minutes", "Cook lasagna noodles", "Layer noodles, sauce, ricotta, and vegetables", "Repeat layers", "Add mozzarella and parmesan on top", "Bake for 40 minutes","Let cool before serving"],
    "Dinner",
    "Italian",
    50,
    "Medium",
    6,
);

// 4–6 ingredients, 1–3 steps, 0–5 min, Easy
const myRecipe7 = new Recipe(
    "Fruit Yogurt Bowl",
    "OngJinXiang-34076352",
    ["Greek yogurt", "Honey", "Strawberries", "Blueberries"],
    ["Add yogurt into bowl", "Add fruit and drizzle honey"],
    "Breakfast",
    "General",
    4,
    "Easy",
    1,
);

// 1–3 ingredients, 4–6 steps, 6–15 min, Easy
const myRecipe8 = new Recipe(
    "Boiled Eggs",
    "OngJinXiang-34076352",
    ["Eggs", "Salt"],
    ["Fill pot with water","boil the pot", "Add eggs in boiling water", "Boil for 7 minutes","Remove and cool in ice water","Peel and season with salt"],
    "Breakfast",
    "General",
    10,
    "Easy",
    2,
);

// 7–10 ingredients, >10 steps, >60 min, Hard
const myRecipe9 = new Recipe(
    "Beef Stew",
    "OngJinXiang-34076352",
    ["Beef chuck", "Potatoes", "Carrots", "Celery", "Onion", "Garlic", "Tomato paste", "Beef broth", "Bay leaf", "Thyme", "Salt", "Pepper"],
    ["Cut beef into cubes","Season beef with salt and pepper","Brown beef in pot","Remove beef and set aside","Saute onion, garlic, celery, and carrots","Add tomato paste and cook briefly","Add beef back to pot","Add potatoes, broth, bay leaf, and thyme","Bring to boil","Reduce heat and simmer","Cook for 90 minutes","Remove bay leaf and serve"],
    "Dinner",
    "European",
    90,
    "Hard",
    5,
);

// >10 ingredients, 7–10 steps, 16–30 min, Medium
const myRecipe10 = new Recipe(
    "Chicken Tikka Wrap",
    "OngJinXiang-34076352",
    ["Chicken breast", "Yogurt", "Lemon juice", "Garam masala", "Cumin", "Coriander", "Paprika", "Garlic", "Ginger", "Salt", "Pepper", "Tortilla wraps", "Lettuce", "Tomato"],
    ["Mix yogurt, lemon juice, and spices","Marinate chicken in mixture","Grill chicken until cooked","Slice chicken","Warm tortilla wraps","Fill with lettuce, tomato, and chicken","Roll up and serve"],
    "Lunch",
    "Indian",
    25,
    "Medium",
    3,
);

const recipeDB = [
    myRecipe,
    myRecipe2,
    myRecipe3,
    myRecipe4,
    myRecipe5,
    myRecipe6,
    myRecipe7,
    myRecipe8,
    myRecipe9,
    myRecipe10
];

module.exports = { recipeDB };