// Validation helpers for ID query params used in pages and API routes

function validateRecipeID(req, res, next) {
  try {
    const { recipeID } = req.query;
    if (typeof recipeID === 'undefined' || recipeID === '') {
      req.selectedRecipe = null;
      req.selectedRecipeId = undefined;
      return next();
    }

    const list = req.app.locals.recipeDB;
    const selected = list.find(r => r.recipeID === recipeID) || null;
    if (selected === null) {
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

function validateItemID(req, res, next) {
  try {
    const { itemID } = req.query;
    if (typeof itemID === 'undefined' || itemID === '') {
      req.selectedItem = null;
      req.selectedItemId = undefined;
      return next();
    }

    const list = req.app.locals.inventoryItemDB;
    const selected = list.find(it => it.itemID === itemID) || null;
    if (selected === null) {
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

function validateRecipeIDQuery(req, res, next) {
  try {
    const { recipeID } = req.query;
    if (!recipeID) {
      const err = new Error('recipeID is required');
      err.status = 400;
      throw err;
    }
    const list = req.app.locals.recipeDB;
    const index = list.findIndex(r => r.recipeID === recipeID);
    if (index === -1) {
      const err = new Error('Recipe not found.');
      err.status = 404;
      throw err;
    }
    req.recipeIndex = index;
    return next();
  } catch (err) {
    err.status = err.status || 400;
    return next(err);
  }
}

function validateItemIDQuery(req, res, next) {
  try {
    const { itemID } = req.query;
    if (!itemID) {
      const err = new Error('itemID is required');
      err.status = 400;
      throw err;
    }
    const list = req.app.locals.inventoryItemDB;
    const index = list.findIndex(it => it.itemID === itemID);
    if (index === -1) {
      const err = new Error('Inventory item not found.');
      err.status = 404;
      throw err;
    }
    req.itemIndex = index;
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
