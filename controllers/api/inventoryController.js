const Inventory = require("../../models/Inventory");
const { peekNextID, incrementID } = require("../../utils/id");

const ALLOWED_ROLES = ["chef", "manager", "admin"];

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
    return res.redirect(`/inventory-34076352?userId=${req.currentUser.userId}`);
  } catch (err) {
    // Show errors on the same form page with friendly message
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
    return res.status(400).render("inventory/inventory-add.html", { error: message, form: req.body || {} });
  }
}

// POST /api/inventory/delete-34076352
async function deleteInventoryItem(req, res, next) {
  try {
    const item = req.item; // from validateItemIDQuery

    // only allow chefs/managers/admins to delete
    if (ALLOWED_ROLES.includes(req.currentUser.role) === false) {
      const err = new Error("Forbidden: insufficient permissions to modify inventory");
      err.status = 403;
      throw err;
    }

    await Inventory.deleteOne({ inventoryId: item.inventoryId });
    return res.redirect(`/inventory-34076352?userId=${req.currentUser.userId}`);
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
    );

    if (!updated) {
      const err = new Error("Inventory item not found.");
      err.status = 404;
      throw err;
    }

    return res.redirect(`/inventory-edit-34076352?itemID=${inventoryId}&userId=${req.currentUser.userId}&notice=updated`);
  } catch (err) {
    if (err.name === "ValidationError" || err.status === 400) {
      const inventoryList = await Inventory.find({}).lean();

      return res.status(400).render("inventory/inventory-edit.html", {
        myInventory: inventoryList,
        selectedItem: inventoryList.find((it) => it.inventoryId === req.body?.inventoryId) || null,
        selectedItemId: req.body?.inventoryId || "",
        error: err.message,
        form: {
          inventoryId: req.body?.inventoryId || "",
          ingredientName: req.body?.ingredientName || "",
          quantity: req.body?.quantity || "",
          unit: req.body?.unit || "",
          category: req.body?.category || "",
          purchaseDate: req.body?.purchaseDate || "",
          expiryDate: req.body?.expiryDate || "",
          location: req.body?.location || "",
          cost: req.body?.cost || "",
        },
      });
    }
    err.status = err.status || 400;
    return next(err);
  }
}

module.exports = {
  addInventoryItem,
  deleteInventoryItem,
  updateInventoryItem,
};
