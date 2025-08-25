const {
    assertString, assertNonNegativeNumber, assertDate
} = require("./validate");

class inventoryItem {
    static itemID = 1

    constructor(userId, ingredientName, quantity, unit, category, purchaseDate, expiryDate, location, cost) {
        this.itemID = `I-${String(inventoryItem.itemID).padStart(5, "0")}`;
        inventoryItem.itemID++;

        this.userId = assertString(userId, "User ID");;
        this.ingredientName = assertString(ingredientName, "Ingredient Name");
        this.quantity = assertNonNegativeNumber(quantity, "Quantity");
        this.unit = assertString(unit, "Unit");
        this.category = assertString(category, "Category");
        this.purchaseDate = assertDate(purchaseDate, "Purchase Date");
        this.expiryDate = assertDate(expiryDate, "Expiry Date");
        this.location = assertString(location, "Location");
        this.cost = assertNonNegativeNumber(cost, "Cost");

        this.dateObj = new Date(); // Format: "YYYY-MM-DDTHH:mm:ss.sssZ"
        this.createdDate = this.dateObj.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    }
}

module.exports = { inventoryItem };