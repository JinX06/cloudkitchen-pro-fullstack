const express = require("express")
const router = express.Router();
const recipeController = require("../../controllers/pages/recipeController");
const { requireAuth, requireRole } = require("../../middleware/auth");

const { validateRecipeID } = require("../../middleware/validation/idValidation.js");

router.use(requireAuth);

// Recipes list page
router.get("/recipes-34076352", requireRole("chef"), recipeController.getRecipesPage);

// Add recipe page
router.get("/recipes-add-34076352", requireRole("chef"), recipeController.getAddRecipePage);

// Edit recipe page
router.get("/recipes-edit-34076352", requireRole("chef"), validateRecipeID, recipeController.getEditRecipePage);

// Remove recipe page
router.get("/recipes-remove-34076352", requireRole("chef"), validateRecipeID, recipeController.getRemoveRecipePage);

// View recipe details
router.get("/recipes-view-34076352", requireRole("chef"), recipeController.getRecipeView);

// Filter recipes
router.get("/recipes-filter-34076352", requireRole("chef"), recipeController.getFilterPage);

// Recipe suggestions form
router.get("/recipes-suggestions-34076352", requireRole("chef"), recipeController.getSuggestionsPage);

// Recipe suggestions results
router.get("/recipes-suggestion-results-34076352", requireRole("chef"), recipeController.getSuggestionResults);

// Search and scale recipes
router.get("/recipes-search-scale-34076352", requireRole("chef"), recipeController.getSearchScale);

// Recipe availability overview
router.get("/recipes-availability-34076352", requireRole("chef"), recipeController.getAvailabilityPage);

module.exports = router;
