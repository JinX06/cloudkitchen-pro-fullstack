const express = require("express")
const router = express.Router()
const inventoryController = require("../../controllers/pages/inventoryController")
const { requireAuth, requireRole } = require("../../middleware/auth");
const { validateItemID } = require("../../middleware/validation/idValidation.js")

// Inventory overview page
router.get("/inventory-34076352", requireAuth, inventoryController.getInventoryPage)

// Add inventory item page
router.get("/inventory-add-34076352", requireAuth, inventoryController.getAddInventoryPage)

// Remove inventory item page
router.get("/inventory-remove-34076352", requireAuth, validateItemID, inventoryController.getRemoveInventoryPage)

// View inventory item details
router.get("/inventory-view-34076352", requireAuth, inventoryController.getInventoryViewPage)

// Inventory alerts (expiring/low stock) - admin only
router.get("/inventory-alerts-34076352", requireRole('admin'), inventoryController.getInventoryAlertsPage)

module.exports = router
