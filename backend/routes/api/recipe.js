const express = require("express")
const router = express.Router();
const recipeApiController = require("../../controllers/api/recipeController");
const { requireAuth, requireRole } = require("../../middleware/auth");
const { validateRecipeReqBody, validateReviewReqBody } = require("../../middleware/validation/recipeValidation");
const { validateRecipeIDQuery } = require("../../middleware/validation/idValidation.js");

// Require auth for all API endpoints
router.use(requireAuth);

// NEW: list recipes for current user
router.get("/recipes-list-34076352", recipeApiController.listRecipes);

// NEW: get a single recipe by recipeId
router.get("/recipes-view-34076352/:id", recipeApiController.getRecipe);

// Add recipe
router.post("/recipes-add-34076352", requireRole("chef"), validateRecipeReqBody, recipeApiController.addRecipe);

// Delete recipe
router.delete("/recipes-delete-34076352", validateRecipeIDQuery, recipeApiController.deleteRecipe);

// Update recipe
router.put("/recipes-update-34076352/:id", requireRole("chef"), validateRecipeReqBody, recipeApiController.updateRecipe);

// Get recipe suggestions (Ignored for now)
// router.post("/recipes-suggestions-34076352", recipeApiController.postRecipeSuggestions);

// Add recipe review (Ignored for now)
// router.post("/recipes/add-review-34076352", validateReviewReqBody, recipeApiController.addReview);

module.exports = router;
