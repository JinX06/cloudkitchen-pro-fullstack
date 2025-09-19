const express = require("express")
const router = express.Router();
const recipeController = require("../../controllers/pages/recipeController");
const { requireAuth, requireRole } = require("../../middleware/auth");

const { validateRecipeID } = require("../../middleware/validation/idValidation.js");

// Recipes list page (chef only)
router.get("/recipes-34076352", requireAuth, requireRole('chef'), recipeController.getRecipesPage);

// Add recipe page (chef only)
router.get("/recipes-add-34076352", requireAuth, requireRole('chef'), recipeController.getAddRecipePage);

// Remove recipe page (chef only)
router.get("/recipes-remove-34076352", requireAuth, requireRole('chef'), validateRecipeID, recipeController.getRemoveRecipePage);

// View recipe details
router.get("/recipes-view-34076352", requireAuth, recipeController.getRecipeView);

// Filter recipes
router.get("/recipes-filter-34076352", requireAuth, recipeController.getFilterPage);

// Recipe suggestions form
router.get("/recipes-suggestions-34076352", requireAuth, recipeController.getSuggestionsPage);

// Recipe suggestions results
router.get("/recipes-suggestion-results-34076352", requireAuth, recipeController.getSuggestionResults);

// Search and scale recipes
router.get("/recipes-search-scale-34076352", requireAuth, recipeController.getSearchScale);

// Recipe availability overview (chef only)
router.get("/recipes-availability-34076352", requireAuth, requireRole('chef'), recipeController.getAvailabilityPage);

module.exports = router;
