const { calculateInventoryValue } = require("../../utils/inventoryUtils.js");
const { uniqueCuisineList } = require("../../utils/recipeUtils.js");

// GET /home-34076352
function getHome(req, res) {
  res.render("index.html", {
    myRecipe: req.app.locals.recipeDB,
    myInventory: req.app.locals.inventoryItemDB,
    myInventoryValue: calculateInventoryValue(req.app.locals.inventoryItemDB),
    myUniqueCuisines: uniqueCuisineList(req.app.locals.recipeDB),
  });
}

module.exports = {
  getHome,
};

