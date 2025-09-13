const { inventoryItem } = require("../../models/inventoryItem");
const { sortInventoryByCategoryAndStorage } = require("../../utils/inventoryUtils");

// POST /api/inventory/add-34076352
function addInventoryItem(req, res) {
  const { userId, ingredientName, quantity, unit, category, purchaseDate, expiryDate, location, cost } = req.validated;
  const item = new inventoryItem(userId, ingredientName, quantity, unit, category, purchaseDate, expiryDate, location, cost);
  req.app.locals.inventoryItemDB.push(item);
  req.app.locals.inventoryItemDB = sortInventoryByCategoryAndStorage(req.app.locals.inventoryItemDB);
  return res.redirect("/inventory-34076352");
}

// POST /api/inventory/delete-34076352
function deleteInventoryItem(req, res) {
  const list = req.app.locals.inventoryItemDB;
  list.splice(req.itemIndex, 1);
  req.app.locals.inventoryItemDB = sortInventoryByCategoryAndStorage(req.app.locals.inventoryItemDB);
  return res.redirect("/inventory-34076352");
}

module.exports = {
  addInventoryItem,
  deleteInventoryItem,
};

