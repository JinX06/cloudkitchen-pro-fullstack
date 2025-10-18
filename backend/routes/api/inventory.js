const express = require("express");
const router = express.Router();
const inventoryApiController = require("../../controllers/api/inventoryController.js");
const { requireAuth } = require("../../middleware/auth.js");
const { validateInventoryReqBody } = require("../../middleware/validation/inventoryValidation.js");
const { validateItemIDQuery } = require("../../middleware/validation/idValidation.js");

// Require auth for all Inventory API endpoints
router.use(requireAuth);

// NEW — list all inventory items for current user
router.get("/inventory-list-34076352", inventoryApiController.listInventory);

// NEW — get a single inventory item by inventoryId
router.get("/inventory-view-34076352/:id", inventoryApiController.getInventoryItem);

// Add inventory item
router.post("/inventory-add-34076352", validateInventoryReqBody, inventoryApiController.addInventoryItem);

// Delete inventory item
router.post("/inventory-delete-34076352", validateItemIDQuery, inventoryApiController.deleteInventoryItem);

// Update inventory item
router.post("/inventory-update-34076352/:id", validateInventoryReqBody, inventoryApiController.updateInventoryItem);


module.exports = router;
