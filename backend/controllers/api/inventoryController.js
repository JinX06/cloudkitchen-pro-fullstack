const Inventory = require("../../models/Inventory");
const { peekNextID, incrementID } = require("../../utils/id");

const ALLOWED_ROLES = ["chef", "manager", "admin"];

// GET /api/inventory-34076352?userId=<id>
async function listInventory(req, res, next) {
  try {
    const items = await Inventory.find({})
      .sort({ expirationDate: 1 })
      .lean();
    return res.status(200).json({ items });
  } catch (err) {
    err.status = err.status || 500;
    return next(err);
  }
}

// GET /api/inventory-34076352/:id?userId=<id>
async function getInventoryItem(req, res, next) {
  try {
    const inventoryId = req.params.id;
    const item = await Inventory.findOne({
      inventoryId,
    }).lean();
    if (!item) {
      return res.status(404).json({ error: "Item Not found" });
    }
    return res.status(200).json({ item });
  } catch (err) {
    err.status = err.status || 500;
    return next(err);
  }
}

// POST /api/inventory/add-34076352
async function addInventoryItem(req, res, next) {
  try {
    const { ingredientName, quantity, unit, category, purchaseDate, expiryDate, location, cost } = req.validated;

    const inventoryId = await peekNextID("inventory");
    await Inventory.create({
      inventoryId,
      userId: req.currentUser.userId,
      ingredientName,
      quantity,
      unit,
      category,
      purchaseDate,
      expirationDate: expiryDate,
      location,
      cost,
    });

    await incrementID("inventory");
    const created = await Inventory.findOne({ inventoryId, userId: req.currentUser.userId }).lean();
    return res.status(201).json({ item: created });
  } catch (err) {
    let message = "Unable to add inventory item.";

    if (err.name === "ValidationError" && err.errors) {
      // Build the error message from Mongoose validation errors one by one
      const messages = [];
      for (const key in err.errors) {
        const e = err.errors[key];
        if (e && typeof e.message === "string") {
          messages.push(e.message);
        }
      }
      message = messages.join(", ");
    } else if (typeof err.message === "string") {
      message = err.message;
    }
    return res.status(400).json({ error: message });
  }
}

// POST /api/inventory/delete-34076352
async function deleteInventoryItem(req, res, next) {
  try {
    const item = req.item;

    if (ALLOWED_ROLES.includes(req.currentUser.role) === false) {
      const err = new Error("Forbidden: insufficient permissions to modify inventory");
      err.status = 403;
      throw err;
    }

    await Inventory.deleteOne({ inventoryId: item.inventoryId });
    return res.status(204).send();
  } catch (err) {
    err.status = err.status || 400;
    return next(err);
  }
}

// POST /api/inventory/update-34076352
async function updateInventoryItem(req, res, next) {
  try {

    if (ALLOWED_ROLES.includes(req.currentUser.role) === false) {
      const err = new Error("Forbidden: insufficient permissions to modify inventory");
      err.status = 403;
      throw err;
    }

    const inventoryId = (req.body?.inventoryId || "").trim();
    if (!inventoryId) {
      const err = new Error("Inventory ID is required");
      err.status = 400;
      throw err;
    }

    const { ingredientName, quantity, unit, category, purchaseDate, expiryDate, location, cost } = req.validated;

    const updateDoc = {
      ingredientName,
      quantity,
      unit,
      category,
      purchaseDate,
      expirationDate: expiryDate,
      location,
      cost,
    };

    const updated = await Inventory.findOneAndUpdate(
      { inventoryId },
      { $set: updateDoc },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.status(200).json({ item: updated });
  } catch (err) {
    if (err.name === "ValidationError" || err.status === 400) {
      const message = err.message || "Unable to update inventory item.";
      return res.status(400).json({ error: message });
    }
    err.status = err.status || 400;
    return next(err);
  }
}

module.exports = {
  addInventoryItem,
  deleteInventoryItem,
  updateInventoryItem,
  listInventory,
  getInventoryItem,
};
