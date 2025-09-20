const Inventory = require("../../models/Inventory");

// GET /inventory-34076352
async function getInventoryPage(req, res, next) {
  try {
    const now = new Date();
    const items = await Inventory.aggregate([
      {
        $addFields: {
          daysLeft: {
            $floor: {
              $divide: [{ $subtract: ["$expirationDate", now] }, 1000 * 60 * 60 * 24]
            }
          }
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    const inventoryValue = items.reduce((sum, item) => sum + Number(item.cost), 0).toFixed(2);

    res.render("inventory/inventory.html", { myInventory: items, inventoryValue });
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

// GET /inventory-edit-34076352
async function getEditInventoryPage(req, res, next) {
  try {
    const selectedId = req.selectedItemId;
    const inventoryList = await Inventory.find({}).sort({ createdAt: -1 }).lean();

    const selectedItem = selectedId ? inventoryList.find((doc) => doc.inventoryId === selectedId) || null : null;

    res.render("inventory/inventory-edit.html", {
      myInventory: inventoryList,
      selectedItem,
      selectedItemId: selectedId,
      error: null,
      form: selectedItem ? {
        inventoryId: selectedItem.inventoryId,
        ingredientName: selectedItem.ingredientName,
        quantity: selectedItem.quantity,
        unit: selectedItem.unit,
        category: selectedItem.category,
        purchaseDate: selectedItem.purchaseDate ? selectedItem.purchaseDate.toISOString().split("T")[0] : "",
        expiryDate: selectedItem.expirationDate ? selectedItem.expirationDate.toISOString().split("T")[0] : "",
        location: selectedItem.location,
        cost: selectedItem.cost,
      } : {},
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
    const now = new Date();
    const itemsWithDaysLeft = await Inventory.aggregate([
      {
        $addFields: {
          daysLeft: {
            $floor: {
              $divide: [{ $subtract: ["$expirationDate", now] }, 1000 * 60 * 60 * 24]
            }
          }
        }
      }
    ]);

    const expiringItems = itemsWithDaysLeft.filter(item => item.daysLeft > 0 && item.daysLeft <= 3);
    const lowStock = itemsWithDaysLeft.filter(item => Number(item.quantity) < 2);

    const categoryGroups = await Inventory.aggregate([
      {
        $group: {
          _id: "$category",
          itemCount: { $sum: 1 },  // Count of items in this category sum += 1
          value: { $sum: "$cost" }
        }
      },
      { $sort: { category: 1 } }
    ]);

    const totals = await Inventory.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: "$cost" },
          totalItems: { $sum: 1 }
        }
      }
    ]);

    const totalValue = (totals[0]?.totalValue || 0).toFixed(2);
    const totalItems = totals[0]?.totalItems || 0;

    res.render("inventory/inventory-alerts.html", {
      expiringItems,
      lowStock,
      myInventoryValue: totalValue,
      totalItems,
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
  getEditInventoryPage,
  getInventoryViewPage,
  getInventoryAlertsPage,
};
