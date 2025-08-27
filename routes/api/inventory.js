const express = require("express");
const router = express.Router();
const { inventoryItem } = require("../../models/inventoryItem");

// POST: add inventory item
router.post("/api/inventory/add-34076352", (req, res) => {
  const {
    userId,
    ingredientName,
    quantity,
    unit,
    category,
    purchaseDate,
    expiryDate,
    location,
    cost
  } = req.body;

  try {
    // Construct item (constructor validates; adjust Number(...) as needed)
    const item = new inventoryItem(
      userId,
      ingredientName,
      Number(quantity),
      unit,
      category,
      purchaseDate,
      expiryDate,
      location,
      Number(cost)
    );

    // Save to in-memory DB
    req.app.locals.inventoryItemDB.push(item);

    // Redirect to inventory list
    return res.redirect("/inventory-34076352");
  } catch (err) {

    req.app.locals.errorOBJ = err;
    return res.redirect("/error-34076352");
  }
});

// New: delete inventory item
router.post("/api/inventory/delete-34076352", (req, res) => {
  const { itemID } = req.query;
  const list = req.app.locals.inventoryItemDB;
  const index = list.findIndex(item => item.itemID === itemID);

  if (index !== -1) {
    list.splice(index, 1);
    return res.redirect("/inventory-34076352");
  } else {
    req.app.locals.errorOBJ = { status: 400, message: "Inventory item not found." };
    return res.redirect("/error-34076352");
  }
});

module.exports = router;