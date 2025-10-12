const express = require("express");
const router = express.Router();
const homeController = require("../../controllers/pages/homeController");
const { requireAuth } = require("../../middleware/auth");

// Home page
router.get("/home-34076352", requireAuth, homeController.getHome);

module.exports = router;
