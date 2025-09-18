const { calculateInventoryValue, uniqueCategoryList } = require("../../utils/inventoryUtils.js");
const Inventory = require("../../models/Inventory");

function daysLeft(expiryDateStr) {
  const expiryDate = new Date(expiryDateStr);
  const today = new Date();
  return Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));
}

// GET /inventory-34076352
async function getInventoryPage(req, res, next) {
  try {
    // Use .lean() to get plain JS objects instead of Mongoose functions
    let myInventory = await Inventory.find({}).lean();

    // Add daysLeft field to each item for display whilst keeping original data using spread (...it)
    myInventory = myInventory.map(it => ({ ...it, daysLeft: daysLeft(it.expirationDate)}));
    const inventoryValue = calculateInventoryValue(myInventory);

    res.render("inventory/inventory.html", { myInventory, inventoryValue });
  } catch (err) { 
    return next(err); 
  }
}

// GET /inventory-add-34076352
function getAddInventoryPage(req, res) {
  res.render("inventory/inventory-add.html", { error: null, form: {} });
}

// GET /inventory-remove-34076352
// Assumes validateItemID middleware populates req.selectedItem and req.selectedItemId
async function getRemoveInventoryPage(req, res, next) {
  try {
    const myInventory = await Inventory.find({})
    res.render("inventory/inventory-remove.html", {
      myInventory,
      selectedItem: req.selectedItem || null,
      selectedItemId: req.selectedItemId,
    });
  } catch (err) { 
    return next(err); 
  }
}

// GET /inventory-view-34076352
async function getInventoryViewPage(req, res, next) {
  try {
    const { itemID } = req.query;
    const selected = await Inventory.findOne({ inventoryId: itemID });
    res.render("inventory/inventory-view.html", { selectedItem: selected });
  } catch (err) { 
    return next(err); 
  }
}

// GET /inventory-alerts-34076352
async function getInventoryAlertsPage(req, res, next) {
  try {
    const items = await Inventory.find({}).lean();

    // Add daysLeft field to each item for display
    const itemsDaysLeft = items.map(it => ({ ...it, daysLeft: daysLeft(it.expirationDate) }));

    // Get expiring items (<= 3 days) and not already expired (> 0 days)
    const expiringItems = itemsDaysLeft.filter(it => it.daysLeft <= 3 && it.daysLeft > 0);

    // Get items which has low stock (< 2 quantity)
    const lowStock = itemsDaysLeft.filter(it => it.quantity < 2);

    // Group items by category for summary
    const uniqueCategories = uniqueCategoryList(items);

    // Calculate item count and total value per category
    const categoryGroups = [];

    for (const category of uniqueCategories) {
        categoryGroups.push({
            category: category,
            itemCount: 0,
            value: 0
        });
    }

    for (const item of items) {
        const group = categoryGroups.find(g => g.category === item.category);
        if (group) {
            group.itemCount++;
            group.value += item.cost;
        }
    }

    res.render("inventory/inventory-alerts.html", {
      expiringItems,
      lowStock,
      myInventoryValue: calculateInventoryValue(items),
      totalItems: items.length,
      categoryGroups,
    });
  } catch (err) { 
    return next(err); 
  }
}

module.exports = {
  getInventoryPage,
  getAddInventoryPage,
  getRemoveInventoryPage,
  getInventoryViewPage,
  getInventoryAlertsPage,
};

