const express = require("express");
const router = express.Router();
const inventoryApiController = require("../../controllers/api/inventoryController");
const { validateInventoryReqBody } = require("../../middleware/validation/inventoryValidation");
const { validateItemIDQuery } = require("../../middleware/validation/idValidation.js");

// Add inventory item
router.post("/inventory/add-34076352", validateInventoryReqBody, inventoryApiController.addInventoryItem);

// Delete inventory item
router.post("/inventory/delete-34076352", validateItemIDQuery, inventoryApiController.deleteInventoryItem);

module.exports = router;
