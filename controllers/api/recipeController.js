const Recipe = require("../../models/Recipe");
const { peekNextID, incrementID } = require("../../utils/id");
const { getRecipeSuggestions } = require("../../utils/recipeSuggestions/recipeSuggestions.js");

// POST /api/recipes/add-34076352
async function addRecipe(req, res, next) {
  try {
    if (!req.currentUser) {return res.redirect("/login-34076352?notice=login-required")
    };
    const { title, ingredients, instructions, mealType, cuisineType, prepTime, difficulty, servings } = req.validated;
    const chef = req.currentUser.fullname || req.currentUser.userId;
    const recipeId = await peekNextID("recipe");
    await Recipe.create({
      recipeId,
      userId: req.currentUser.userId,
      title,
      chef,
      ingredients,
      instructions,
      mealType,
      cuisineType,
      prepTime,
      difficulty,
      servings,
      ratings: [],
      reviews: [],
      avgRating: 0,
    });
    await incrementID("recipe");
    return res.redirect(`/recipes-34076352?userId=${req.currentUser.userId}`);
  } catch (err) {
    // Friendly validation message on the same add page
    const cuisines = ["Italian","Asian","Mexican","American","French","Indian","Mediterranean","Other"];
    let message = "Unable to add recipe.";
    console.log(err)

    // Duplicate title validation message
    if (err && err.code === 11000) {
      message = "You already have a recipe with that title. Please choose a different title.";
    } 
    
    // Other validation messages
    else if (err.name === "ValidationError" && err.errors) {
      const messages = [];
      for (const key in err.errors) {
        const e = err.errors[key];
        if (typeof e.message === "string") {
          messages.push(e.message);
        }
      }
      message = messages.join(" ");
    } 
    
    const form = req.body || {};
    return res.status(400).render("recipes/recipe-add.html", { cuisines, error: message, form });
  }
}

// POST /api/recipes/delete-34076352
async function deleteRecipe(req, res, next) {
  try {
    if (!req.currentUser) return res.redirect("/login-34076352?notice=login-required");
    const recipe = req.recipe; // from validateRecipeIDQuery
    // Only the owning chef can delete per spec
    if (req.currentUser.role !== "chef" || recipe.userId !== req.currentUser.userId) {
      const err = new Error("Forbidden: you do not have permission to delete this recipe!");
      err.status = 403;
      throw err;
    }
    await Recipe.deleteOne({ recipeId: recipe.recipeId });
    return res.redirect(`/recipes-34076352?userId=${req.currentUser.userId}`);
  } catch (err) {
    err.status = err.status || 400;
    return next(err);
  }
}

// POST /api/recipes-suggestions-34076352
async function postRecipeSuggestions(req, res, next) {
  try {
    if (!req.currentUser) {
      return res.redirect("/login-34076352?notice=login-required")
    };

    const userResponse = {
      cuisineType: req.body.cuisineType,
      prepBucket: req.body.prepBucket,
      difficulty: req.body.difficulty,
      ingBucket: req.body.ingBucket,
      stepBucket: req.body.stepBucket,
      mealType: req.body.mealType,
    };

    const list = await Recipe.find({ userId: req.currentUser.userId }).lean();
    req.app.locals.suggestedRecipes = getRecipeSuggestions(userResponse, list);
    return res.redirect(`/recipes-suggestion-results-34076352?userId=${req.currentUser.userId}`);
  } catch (err) {
    return next(err);
  }
}

// POST /api/recipes/add-review-34076352
async function addReview(req, res, next) {
  try {
    if (!req.currentUser) {
      return res.redirect("/login-34076352?notice=login-required");
    }
    const { recipeID, reviewer, rating, comment } = req.validated;
    const recipe = await Recipe.findOne({ recipeId: recipeID });
    if (!recipe) {
      const err = new Error("Recipe not found.");
      err.status = 400;
      throw err;
    }
    recipe.ratings.push(rating);
    recipe.reviews.push({ reviewer, rating, comment, date: new Date().toISOString().split("T")[0] });
    const sum = recipe.ratings.reduce((a, b) => a + b, 0);
    recipe.avgRating = Math.round((sum / recipe.ratings.length) * 100) / 100;
    await recipe.save();
    return res.redirect(`/recipes-34076352?userId=${req.currentUser.userId}`);
  } catch (err) {
    err.status = err.status || 400;
    return next(err);
  }
}

module.exports = {
  addRecipe,
  deleteRecipe,
  postRecipeSuggestions,
  addReview,
};
