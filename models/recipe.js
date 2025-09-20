const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  reviewer: { 
    type: String, 
    trim: true, 
    default: "Anonymous" 
  },

  rating: { 
    type: Number, 
    min: [1, "Rating must be between 1 and 5."],
    max: [5, "Rating must be between 1 and 5."],
    required: [true, "Rating is required."]
  },

  comment: { 
    type: String, 
    trim: true,
    default: "" 
  },
  date: {
    type: String, 
    required: [true, "Review date is required."]
  }
}, { _id: false });

const RecipeSchema = new mongoose.Schema({
  recipeId: {
    type: String,
    required: [true, "Recipe ID is required."],
    unique: true,
    match: [/^R-\d{5}$/, "Recipe ID must follow the format R-00000."],
  },
  userId: {
    type: String,
    ref: "User",
    required: [true, "User ID is required."],
    match: [/^U-\d{5}$/, "User ID must follow the format U-00000."],
  },
  title: {
    type: String,
    required: [true, "Title is required."],
    trim: true,
    minlength: [3, "Title must be at least 3 characters."],
    maxlength: [100, "Title must be at most 100 characters."]
  },
  chef: {
    type: String,
    required: [true, "Chef name is required."],
    trim: true,
    minlength: [2, "Chef name must be at least 2 characters."],
    maxlength: [100, "Chef name must be at most 100 characters."],
    match: [/^[A-Za-z][A-Za-z\s\-\u0027]{1,99}$/, "Chef name must start with a letter and include only letters, spaces, hyphens, or apostrophes (2-100 characters)."],
  },
  ingredients: {
    type: [String],
    validate: {
      validator: function validateIngredients(ingredientsArray) {
        if (!Array.isArray(ingredientsArray)){
          return false
        };

        const size = ingredientsArray.length;
        if (size < 1 || size > 20){
          return false;
        }

        for (let i = 0; i < size; i++) {
          const ingredient = ingredientsArray[i];
          if (typeof ingredient !== "string") return false;
          if (ingredient.trim().length < 3) return false;
        }

        return true;
      },
      message: "Ingredients must be an array of 1-20 strings each with at least 3 characters."
    }
  },
  instructions: {
    type: [String],
    validate: {
      validator: function validateInstructions(stepsArray) {
        if (!Array.isArray(stepsArray)) return false;

        const size = stepsArray.length;
        if (size < 1 || size > 15) return false;

        for (let i = 0; i < size; i++) {
          const step = stepsArray[i];
          if (typeof step !== "string") return false;
          if (String(step).trim().length < 10) return false;
        }

        return true;
      },
      message: "Instructions must be 1-15 steps; each >= 10 chars."
    }
  },
  mealType: { 
    type: String, 
    required: [true, "Meal type is required."],
    enum: { 
      values: ["Breakfast", "Lunch", "Dinner", "Snack"], 
    message: "Meal Type must be one of: Breakfast, Lunch, Dinner, Snack." 
    }
},

  cuisineType: { 
    type: String, 
    enum: { 
      values: ["Italian", "Asian", "Mexican", "American", "French", "Indian", "Mediterranean", "Other"],
      message: "Cuisine Type must be one of: Italian, Asian, Mexican, American, French, Indian, Mediterranean, Other." 
    },
    required: [true, "Cuisine type is required."]
  },

  prepTime: { 
    type: Number, 
    required: [true, "Prep time is required."],
    min: [1, "Prep Time must be between 1 and 480 minutes."], 
    max: [480, "Prep Time must be between 1 and 480 minutes."], 
    validate: { 
      validator: Number.isInteger, 
      message: "prepTime must be an integer" 
    } 
  },

  difficulty: { 
    type: String, 
    enum: { 
      values: ["Easy", "Medium", "Hard"], 
      message: "Difficulty must be one of: Easy, Medium, Hard." 
    }, 
    required: [true, "Difficulty is required."]
  },
  
  servings: { 
    type: Number, 
    required: [true, "Servings is required."],
    min: [1, "Servings must be between 1 and 20."], 
    max: [20, "Servings must be between 1 and 20."], 
    validate: { 
      validator: Number.isInteger, 
      message: "servings must be an integer" 
    } 
  },
  ratings: { type: [Number], default: [] },
  reviews: { type: [ReviewSchema], default: [] },
  avgRating: { type: Number, default: 0 }

}, { timestamps: true }); // use mongoose createdAt, updatedAt timestamps

RecipeSchema.index({ userId: 1, title: 1 }, { unique: true });

module.exports = mongoose.model("Recipe", RecipeSchema);
