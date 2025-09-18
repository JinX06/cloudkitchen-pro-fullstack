const {assertNonNumericString,assertNonNegativeNumber,assertDate, assertEnum} = require("../../models/validate");

/**
 * Middleware to validate inventory item
 */
const validateInventoryReqBody = (req, res, next) => {
    try {
        const {
            userId,
            ingredientName,
            quantity,
            unit,
            category,
            purchaseDate,
            expiryDate,
            location,
            cost
        } = req.body;

        // Validate string fields
        const validatedIngredientName = assertNonNumericString(ingredientName, "Ingredient Name");
        // Enums
        const allowedUnits = ["pieces","kg","g","liters","ml","cups","tbsp","tsp","dozen"];
        const allowedCategories = ["Vegetables","Fruits","Meat","Dairy","Grains","Spices","Beverages","Frozen","Canned","Other"];
        const allowedLocations = ["Fridge","Freezer","Pantry","Counter","Cupboard"];

        const validatedUnit = assertEnum(unit, allowedUnits, "Unit").toLowerCase();
        const validatedCategory = assertEnum(category, allowedCategories, "Category");
        const validatedLocation = assertEnum(location, allowedLocations, "Location");

        // Validate numeric fields
        const validatedQuantity = assertNonNegativeNumber(Number(quantity), "Quantity");
        const validatedCost = assertNonNegativeNumber(Number(cost), "Cost");

        // Validate date fields using the existing assertDate function
        const validatedPurchaseDate = assertDate(purchaseDate, "Purchase Date");
        const validatedExpiryDate = assertDate(expiryDate, "Expiry Date");

        // Store validated data for use in the route handler
        req.validated = {
            ingredientName: validatedIngredientName,
            quantity: validatedQuantity,
            unit: validatedUnit,
            category: validatedCategory,
            purchaseDate: validatedPurchaseDate,
            expiryDate: validatedExpiryDate,
            location: validatedLocation,
            cost: validatedCost
        };

        next();
    } catch (err) {
        err.status = err.status || 400;
        return next(err);
    }
};

module.exports = {
    validateInventoryReqBody
};
