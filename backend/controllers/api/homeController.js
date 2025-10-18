const { calculateInventoryValue } = require("../../utils/inventoryUtils.js");
const Recipe = require("../../models/recipe.js");
const Inventory = require("../../models/Inventory.js");
const User = require("../../models/User.js");

async function getDashboardStats(req, res, next) {
  try {
    if (!req.currentUser) {
      const err = new Error("Authentication required");
      err.status = 401;
      throw err;
    }

    const totalUsers = await User.countDocuments({});
    const totalRecipes = await Recipe.countDocuments({});
    const totalInventory = await Inventory.countDocuments({});
    const myRecipes = await Recipe.countDocuments({ userId: req.currentUser.userId });
    const cuisines = await Recipe.distinct("cuisineType", { userId: req.currentUser.userId });

    const myInventoryItems = await Inventory.find({ userId: req.currentUser.userId });
    const inventoryValue = calculateInventoryValue(myInventoryItems);
    return res.status(200).json({
      users: totalUsers,
      recipes: totalRecipes,
      inventory: totalInventory,
      myRecipeCount: myRecipes,
      cuisineCount: cuisines.length,
      inventoryValue,
      currentUser: {
        userId: req.currentUser.userId,
        fullname: req.currentUser.fullname,
        email: req.currentUser.email,
        role: req.currentUser.role,
        phone: req.currentUser.phone,
      },
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getDashboardStats,
};
