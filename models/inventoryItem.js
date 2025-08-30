const {
    assertString, assertNonNegativeNumber, assertDate, assertNonNumericString
} = require("./validate");

class inventoryItem {
    static itemID = 1

    constructor(userId, ingredientName, quantity, unit, category, purchaseDate, expiryDate, location, cost) {
        this.itemID = `I-${String(inventoryItem.itemID).padStart(5, "0")}`;
        inventoryItem.itemID++;

        this.userId = assertNonNumericString(userId, "User ID");
        this.ingredientName = assertNonNumericString(ingredientName, "Ingredient Name");
        this.quantity = assertNonNegativeNumber(quantity, "Quantity");
        this.unit = assertNonNumericString(unit, "Unit");
        this.category = assertNonNumericString(category, "Category");
        this.purchaseDate = assertDate(purchaseDate, "Purchase Date");
        this.expiryDate = assertDate(expiryDate, "Expiry Date");
        this.location = assertNonNumericString(location, "Location");
        this.cost = assertNonNegativeNumber(cost, "Cost");

        this.dateObj = new Date(); // Format: "YYYY-MM-DDTHH:mm:ss.sssZ"
        this.createdDate = this.dateObj.toISOString().split("T")[0]; // Format: YYYY-MM-DD

        this.daysLeft = this.getExpiryStatus(); // for displaying expiry status in inventory view page
        console.log(this.daysLeft);
    }


    getExpiryStatus() {
        const expiryDate = new Date(this.expiryDate);
        const today = new Date();
        const daysLeft = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24)); // deviding by total milliseconds in a day

        return daysLeft
    }
}

module.exports = { inventoryItem };