const express = require("express");

const router = express.Router();

const { requireAuth } = require("../../middleware/auth");
const { getDashboardStats } = require("../../controllers/api/homeController");

router.use(requireAuth);

router.get("/dashboard-stats-34076352", getDashboardStats);

module.exports = router;
