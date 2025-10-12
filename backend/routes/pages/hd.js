const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../../middleware/auth");
const hdTaskController = require("../../controllers/pages/hdTaskController");

router.get("/smart-recipe-recommendations-34076352", requireAuth, requireRole("chef"), hdTaskController.getSmartRecipeRecommendationsPage);

router.get("/recipe-analytics-dashboard-34076352", requireAuth, requireRole("admin"), hdTaskController.getRecipeAnalyticsDashboard);

router.get('/smart-inventory-management-34076352', requireAuth, hdTaskController.getSmartInventoryManagementPage);

module.exports = router;
