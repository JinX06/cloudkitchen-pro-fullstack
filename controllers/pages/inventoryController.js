const { calculateInventoryValue, uniqueCategoryList } = require("../../utils/inventoryUtils.js");

// GET /inventory-34076352
function getInventoryPage(req, res) {
  res.render("inventory/inventory.html", {
    myInventory: req.app.locals.inventoryItemDB,
    inventoryValue: calculateInventoryValue(req.app.locals.inventoryItemDB),
  });
}

// GET /inventory-add-34076352
function getAddInventoryPage(req, res) {
  res.render("inventory/inventory-add.html");
}

// GET /inventory-remove-34076352
// Assumes validateItemID middleware populates req.selectedItem and req.selectedItemId
function getRemoveInventoryPage(req, res) {
  const list = req.app.locals.inventoryItemDB;
  res.render("inventory/inventory-remove.html", {
    myInventory: list,
    selectedItem: req.selectedItem || null,
    selectedItemId: req.selectedItemId,
  });
}

// GET /inventory-view-34076352
function getInventoryViewPage(req, res) {
  const list = req.app.locals.inventoryItemDB;
  const { itemID } = req.query;
  let selected = null;

  if (itemID) {
    selected = list.find((it) => it.itemID === itemID) || null;
  }

  res.render("inventory/inventory-view.html", {
    selectedItem: selected,
  });
}

// GET /inventory-alerts-34076352
function getInventoryAlertsPage(req, res) {
  let expiringItems = [];
  for (const item of req.app.locals.inventoryItemDB) {
    if (item.daysLeft <= 3 && item.daysLeft > 0) {
      expiringItems.push(item);
    }
  }

  let lowStock = [];
  for (const item of req.app.locals.inventoryItemDB) {
    if (item.quantity < 2) {
      lowStock.push(item);
    }
  }

  const uniqueCategories = uniqueCategoryList(req.app.locals.inventoryItemDB);
  const categoryGroups = [];

  for (const category of uniqueCategories) {
    categoryGroups.push({
      category: category,
      itemCount: 0,
      value: 0,
    });
  }

  for (const item of req.app.locals.inventoryItemDB) {
    const group = categoryGroups.find((g) => g.category === item.category);
    if (group) {
      group.itemCount++;
      group.value += item.cost;
    }
  }

  res.render("inventory/inventory-alerts.html", {
    expiringItems: expiringItems,
    lowStock: lowStock,
    myInventoryValue: calculateInventoryValue(req.app.locals.inventoryItemDB),
    totalItems: req.app.locals.inventoryItemDB.length,
    categoryGroups: categoryGroups,
  });
}

module.exports = {
  getInventoryPage,
  getAddInventoryPage,
  getRemoveInventoryPage,
  getInventoryViewPage,
  getInventoryAlertsPage,
};

