const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../../middleware/auth");
const hdTaskController = require("../../controllers/pages/hdTaskController");

router.get(
  "/smart-recipe-recommendations-34076352", requireAuth, requireRole("chef"), hdTaskController.getSmartRecipeRecommendationsPage
);

module.exports = router;
