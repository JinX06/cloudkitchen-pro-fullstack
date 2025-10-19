const express = require("express");

const router = express.Router();

const { requireAuth, requireRole } = require("../../middleware/auth");
const { analyzeRecipeHealth } = require("../../controllers/api/aiController");

router.use(requireAuth);

router.post("/ai-health-34076352", requireRole("chef"), analyzeRecipeHealth);

module.exports = router;
