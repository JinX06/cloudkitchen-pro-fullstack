const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  reviewer: { 
    type: String, 
    trim: true, 
    default: 'Anonymous' 
  },

  rating: { 
    type: Number, 
    min: 1, 
    max: 5, 
    required: true 
  },

  comment: { 
    type: String, 
    trim: true, 
    default: '' 
  },
  date: { 
    type: String, 
    required: true 
  }
}, { _id: false });

const RecipeSchema = new mongoose.Schema({
  recipeId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  chef: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
    match: /^[A-Za-z][A-Za-z\s\-']{1,99}$/,
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
          if (typeof ingredient !== 'string') return false;
          if (ingredient.trim().length < 3) return false;
        }

        return true;
      },
      message: 'Ingredients must be an array of 1-20 strings; each at least 3 characters.'
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
          if (typeof step !== 'string') return false;
          if (String(step).trim().length < 10) return false;
        }

        return true;
      },
      message: 'Instructions must be 1-15 steps; each >= 10 chars.'
    }
  },
  mealType: { 
    type: String, 
    required: true,
    enum: { 
      values: ['Breakfast', 'Lunch', 'Dinner', 'Snack'], 
    message: 'Meal Type must be one of: Breakfast, Lunch, Dinner, Snack.' 
    }
},

  cuisineType: { 
    type: String, 
    enum: { 
      values: ['Italian', 'Asian', 'Mexican', 'American', 'French', 'Indian', 'Mediterranean', 'Other'],
      message: 'Cuisine Type must be one of: Italian, Asian, Mexican, American, French, Indian, Mediterranean, Other.' 
    },
    required: true
  },

  prepTime: { 
    type: Number, 
    required: true, 
    min: [1, 'Prep Time must be between 1 and 480 minutes.'], 
    max: [480, 'Prep Time must be between 1 and 480 minutes.'], 
    validate: { 
      validator: Number.isInteger, 
      message: 'prepTime must be an integer' 
    } 
  },

  difficulty: { 
    type: String, 
    enum: { 
      values: ['Easy', 'Medium', 'Hard'], 
      message: 'Difficulty must be one of: Easy, Medium, Hard.' 
    }, 
    required: true 
  },
  
  servings: { 
    type: Number, 
    required: true, 
    min: [1, 'Servings must be between 1 and 20.'], 
    max: [20, 'Servings must be between 1 and 20.'], 
    validate: { 
      validator: Number.isInteger, 
      message: 'servings must be an integer' 
    } 
  },
  ratings: { type: [Number], default: [] },
  reviews: { type: [ReviewSchema], default: [] },
  avgRating: { type: Number, default: 0 }

}, { timestamps: true }); // use mongoose createdAt, updatedAt timestamps

RecipeSchema.index({ userId: 1, title: 1 }, { unique: true });

module.exports = mongoose.model('Recipe', RecipeSchema);
