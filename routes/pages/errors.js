const express = require("express")
const router = express.Router();
const errorsController = require("../../controllers/pages/errorsController");

// Custom 404 page route
router.get("/not-found-34076352", errorsController.getNotFound);

module.exports = router;
