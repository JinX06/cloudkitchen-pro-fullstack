const express = require("express")
const router = express.Router();
const recipeApiController = require("../../controllers/api/recipeController");
const { requireAuth, requireRole } = require("../../middleware/auth");
const { validateRecipeReqBody, validateReviewReqBody } = require("../../middleware/validation/recipeValidation");
const { validateRecipeIDQuery } = require("../../middleware/validation/idValidation.js");

// Require auth for all API endpoints
router.use(requireAuth);

// Add recipe
router.post("/recipes/add-34076352", requireRole("chef"), validateRecipeReqBody, recipeApiController.addRecipe);

// Delete recipe
router.post("/recipes/delete-34076352", validateRecipeIDQuery, recipeApiController.deleteRecipe);

// Get recipe suggestions
router.post("/recipes-suggestions-34076352", recipeApiController.postRecipeSuggestions);

// Add recipe review
router.post("/recipes/add-review-34076352", validateReviewReqBody, recipeApiController.addReview);

module.exports = router;
