const express = require("express");
const router = express.Router();
const homeController = require("../../controllers/pages/homeController");

// Home page
router.get("/home-34076352", homeController.getHome);

module.exports = router;
