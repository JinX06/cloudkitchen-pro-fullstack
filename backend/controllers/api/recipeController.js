const Recipe = require("../../models/recipe.js");
const { peekNextID, incrementID } = require("../../utils/id");

// GET /api/recipes-34076352
async function listRecipes(req, res, next) {
  try {
    const items = await Recipe.find({ userId: req.currentUser.userId })
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json({ items });
  } catch (err) {
    err.status = err.status || 500;
    return next(err);
  }
}

// GET /api/recipes-34076352/:id
async function getRecipe(req, res, next) {
  try {
    const recipeId = req.params.id;
    const item = await Recipe.findOne({ recipeId, userId: req.currentUser.userId }).lean();
    if (!item) {
      return res.status(404).json({ error: "Not found" });
    }
    return res.status(200).json({ item });
  } catch (err) {
    err.status = err.status || 500;
    return next(err);
  }
}

// POST /api/recipes/add-34076352
async function addRecipe(req, res, next) {
  try {
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
    const created = await Recipe.findOne({ recipeId, userId: req.currentUser.userId }).lean();
    return res.status(201).json({ recipe: created });
  } catch (err) {
    // Friendly validation message on the same add page
    let message = "Unable to add recipe.";

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
    return res.status(400).json({ error: message });
  }
}

// POST /api/recipes/delete-34076352
async function deleteRecipe(req, res, next) {
  try {
    const recipe = req.recipe; // from validateRecipeIDQuery
    // Only the owning chef can delete per spec
    if (req.currentUser.role !== "chef" || recipe.userId !== req.currentUser.userId) {
      const err = new Error("Forbidden: you do not have permission to delete this recipe!");
      err.status = 403;
      throw err;
    }
    await Recipe.deleteOne({ recipeId: recipe.recipeId });
    return res.status(204).send();
  } catch (err) {
    err.status = err.status || 400;
    return next(err);
  }
}

// POST /api/recipes/update-34076352
async function updateRecipe(req, res, next) {
  try {
    if (req.currentUser.role !== "chef") {
      const err = new Error("Forbidden: you do not have permission to update recipes.");
      err.status = 403;
      throw err;
    }

    const recipeId = (req.params?.id || req.body?.recipeId || "").trim();
    if (!recipeId) {
      const err = new Error("Recipe ID is required.");
      err.status = 400;
      throw err;
    }

    const {
      title,
      ingredients,
      instructions,
      mealType,
      cuisineType,
      prepTime,
      difficulty,
      servings,
    } = req.validated;

    const updateDoc = {
      title,
      ingredients,
      instructions,
      mealType,
      cuisineType,
      prepTime,
      difficulty,
      servings,
    };

    const updated = await Recipe.findOneAndUpdate(
      { recipeId, userId: req.currentUser.userId },
      { $set: updateDoc },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      const err = new Error("Recipe not found or you do not have permission to modify it.");
      err.status = 404;
      throw err;
    }

    return res.status(200).json({ recipe: updated });
  } catch (err) {
    if (err.name === "ValidationError" && err.errors) {
      const messages = Object.values(err.errors)
        .map((e) => (typeof e.message === "string" ? e.message : null))
        .filter(Boolean)
        .join(" ");
      return res.status(400).json({ error: messages || 'Unable to update recipe.' });
    }

    if (err.status === 400) {
      return res.status(400).json({ error: err.message });
    }

    err.status = err.status || 400;
    return next(err);
  }
}

module.exports = {
  addRecipe,
  deleteRecipe,
  updateRecipe,
  listRecipes,
  getRecipe,
};
