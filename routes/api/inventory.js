const express = require("express");
const router = express.Router();
const { inventoryItem } = require("../../models/inventoryItem");
const { sortInventoryByCategoryAndStorage } = require("../../utils/inventoryUtils");
const { validateInventoryReqBody } = require("../../middleware/validation/inventoryValidation");

router.post("/api/inventory/add-34076352", validateInventoryReqBody, (req, res) => {
  // Use validated data from middleware
  const {userId, ingredientName, quantity, unit, category, purchaseDate, expiryDate, location, cost} = req.validated;

  // Construct item object with validated data
  const item = new inventoryItem(userId, ingredientName, quantity, unit, category, purchaseDate, expiryDate, location, cost);

  // Save to inventory DB and sort
  req.app.locals.inventoryItemDB.push(item);
  req.app.locals.inventoryItemDB = sortInventoryByCategoryAndStorage(req.app.locals.inventoryItemDB);

  // Redirect to inventory list
  return res.redirect("/inventory-34076352");
});

// delete inventory item
router.post("/api/inventory/delete-34076352", (req, res) => {
  const { itemID } = req.query;
  const list = req.app.locals.inventoryItemDB;
  const index = list.findIndex(item => item.itemID === itemID);

  if (index !== -1) {
    list.splice(index, 1);
    req.app.locals.inventoryItemDB = sortInventoryByCategoryAndStorage(req.app.locals.inventoryItemDB);
    return res.redirect("/inventory-34076352");

  } else {
    req.app.locals.errorOBJ = { status: 400, message: "Inventory item not found." };
    return res.redirect("/error-34076352");
  }
});

module.exports = router;