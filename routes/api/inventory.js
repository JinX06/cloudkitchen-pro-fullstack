const express = require("express");
const router = express.Router();
const inventoryApiController = require("../../controllers/api/inventoryController");
const { requireAuth } = require("../../middleware/auth");
const { validateInventoryReqBody } = require("../../middleware/validation/inventoryValidation");
const { validateItemIDQuery } = require("../../middleware/validation/idValidation.js");

// Require auth for all Inventory API endpoints
router.use(requireAuth);

// Add inventory item
router.post("/inventory/add-34076352", validateInventoryReqBody, inventoryApiController.addInventoryItem);

// Delete inventory item
router.post("/inventory/delete-34076352", validateItemIDQuery, inventoryApiController.deleteInventoryItem);

// Update inventory item
router.post("/inventory/update-34076352", validateInventoryReqBody, inventoryApiController.updateInventoryItem);


module.exports = router;
