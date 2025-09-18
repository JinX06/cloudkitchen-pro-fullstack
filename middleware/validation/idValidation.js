const Recipe = require('../../models/Recipe');
const Inventory = require('../../models/Inventory');

async function validateRecipeID(req, res, next) {
  try {
    const { recipeID } = req.query;
    if (typeof recipeID === 'undefined' || recipeID === '') {
      req.selectedRecipe = null;
      req.selectedRecipeId = undefined;
      return next();
    }
    const selected = await Recipe.findOne({ recipeId: recipeID });
    if (!selected) {
      const err = new Error('Recipe not found.');
      err.status = 404;
      throw err;
    }

    req.selectedRecipe = selected;
    req.selectedRecipeId = recipeID;
    return next();
  } catch (err) {
    err.status = err.status || 400;
    return next(err);
  }
}

async function validateItemID(req, res, next) {
  try {
    const { itemID } = req.query;
    if (typeof itemID === 'undefined' || itemID === '') {
      req.selectedItem = null;
      req.selectedItemId = undefined;
      return next();
    }
    const selected = await Inventory.findOne({ inventoryId: itemID });
    if (!selected) {
      const err = new Error('Item not found.');
      err.status = 404;
      throw err;
    }

    req.selectedItem = selected;
    req.selectedItemId = itemID;
    return next();
  } catch (err) {
    err.status = err.status || 400;
    return next(err);
  }
}

async function validateRecipeIDQuery(req, res, next) {
  try {
    const { recipeID } = req.query;
    if (!recipeID) {
      const err = new Error('recipeID is required');
      err.status = 400;
      throw err;
    }
    const recipe = await Recipe.findOne({ recipeId: recipeID });
    if (!recipe) {
      const err = new Error('Recipe not found.');
      err.status = 404;
      throw err;
    }
    req.recipe = recipe;
    return next();
  } catch (err) {
    err.status = err.status || 400;
    return next(err);
  }
}

async function validateItemIDQuery(req, res, next) {
  try {
    const { itemID } = req.query;
    if (!itemID) {
      const err = new Error('itemID is required');
      err.status = 400;
      throw err;
    }
    const item = await Inventory.findOne({ inventoryId: itemID });
    if (!item) {
      const err = new Error('Inventory item not found.');
      err.status = 404;
      throw err;
    }
    req.item = item;
    return next();
  } catch (err) {
    err.status = err.status || 400;
    return next(err);
  }
}

module.exports = {
  validateRecipeID,
  validateItemID,
  validateRecipeIDQuery,
  validateItemIDQuery,
};
