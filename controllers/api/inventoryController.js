const Inventory = require("../../models/Inventory");
const { peekNextID, incrementID } = require("../../utils/id");

// POST /api/inventory/add-34076352
async function addInventoryItem(req, res, next) {
  try {
    if (!req.currentUser) return res.redirect('/login-34076352?notice=login-required');
    const { ingredientName, quantity, unit, category, purchaseDate, expiryDate, location, cost } = req.validated;

    const inventoryId = await peekNextID('inventory');
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
    
    await incrementID('inventory');
    return res.redirect(`/inventory-34076352?userId=${req.currentUser.userId}`);
  } catch (err) {
    // Show errors on the same form page with friendly message
    let message = 'Unable to add inventory item.';

    if (err.name === 'ValidationError' && err.errors) {
      // Build the error message from Mongoose validation errors one by one
      const messages = [];
      for (const key in err.errors) {
        const e = err.errors[key];
        if (e && typeof e.message === 'string') {
          messages.push(e.message);
        }
      }
      message = messages.join(', ');
    } else if (typeof err.message === 'string') {
      message = err.message;
    }
    return res.status(400).render('inventory/inventory-add.html', { error: message, form: req.body || {} });
  }
}

// POST /api/inventory/delete-34076352
async function deleteInventoryItem(req, res, next) {
  try {
    if (!req.currentUser) return res.redirect('/login-34076352?notice=login-required');
    const item = req.item; // from validateItemIDQuery

    // only allow chefs/managers/admins to delete
    if (['chef','manager','admin'].includes(req.currentUser.role) === false) {
      const err = new Error('Forbidden: insufficient permissions to modify inventory');
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

module.exports = {
  addInventoryItem,
  deleteInventoryItem,
};
