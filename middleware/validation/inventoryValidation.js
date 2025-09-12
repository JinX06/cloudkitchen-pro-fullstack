const {assertNonNumericString,assertNonNegativeNumber,assertDate} = require("../../models/validate");

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
        const validatedUserId = assertNonNumericString(userId, "User ID");
        const validatedIngredientName = assertNonNumericString(ingredientName, "Ingredient Name");
        const validatedUnit = assertNonNumericString(unit, "Unit");
        const validatedCategory = assertNonNumericString(category, "Category");
        const validatedLocation = assertNonNumericString(location, "Location");

        // Validate numeric fields
        const validatedQuantity = assertNonNegativeNumber(Number(quantity), "Quantity");
        const validatedCost = assertNonNegativeNumber(Number(cost), "Cost");

        // Validate date fields using the existing assertDate function
        const validatedPurchaseDate = assertDate(purchaseDate, "Purchase Date");
        const validatedExpiryDate = assertDate(expiryDate, "Expiry Date");

        // Store validated data for use in the route handler
        req.validated = {
            userId: validatedUserId,
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
