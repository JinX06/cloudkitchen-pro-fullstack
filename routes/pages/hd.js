const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../../middleware/auth");
const hdTaskController = require("../../controllers/pages/hdTaskController");

router.get(
  "/smart-recipe-recommendations-34076352", requireAuth, requireRole("chef"), hdTaskController.getSmartRecipeRecommendationsPage
);

// Add new route for analytics dashboard, restricted to admin users
router.get(
  "/recipe-analytics-dashboard-34076352", requireAuth, requireRole("admin"), hdTaskController.getRecipeAnalyticsDashboard
);



module.exports = router;
