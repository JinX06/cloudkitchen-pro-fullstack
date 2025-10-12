const { calculateInventoryValue } = require("../../utils/inventoryUtils.js");
const Recipe = require("../../models/Recipe.js");
const Inventory = require("../../models/Inventory.js");
const User = require("../../models/User.js");

// GET /home-34076352
async function getHome(req, res, next) {
  try {
    if (!req.currentUser) return res.redirect("/login-34076352?notice=login-required");

    const totalUsers = await User.countDocuments({});
    const totalRecipes = await Recipe.countDocuments({});
    const totalInventory = await Inventory.countDocuments({});
    const myRecipes = await Recipe.countDocuments({ userId: req.currentUser.userId });
    const cuisines = await Recipe.distinct("cuisineType", { userId: req.currentUser.userId });
    
    const allInv = await Inventory.find({});
    const inventoryValue = calculateInventoryValue(allInv);

    const role = req.currentUser.role;
    let view;
    if (role === "admin") view = "home/admin.html";
    else if (role === "chef") view = "home/chef.html";
    else if (role === "manager") view = "home/manager.html";

    return res.render(view, {
      userCount: totalUsers,
      recipeCount: totalRecipes,
      inventoryCount: totalInventory,
      myRecipeCount: myRecipes,
      cuisineCount: cuisines.length,
      inventoryValue,
    });
  } catch (err) { return next(err); }
}

module.exports = {
  getHome,
};
