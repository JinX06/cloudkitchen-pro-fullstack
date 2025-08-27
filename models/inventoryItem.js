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

    getJSON() {
        const ret = {
            itemID: this.itemID,
            userId: this.userId,
            ingredientName: this.ingredientName,
            quantity: this.quantity,
            unit: this.unit,
            category: this.category,
            purchaseDate: this.purchaseDate,
            expiryDate: this.expiryDate,
            location: this.location,
            cost: this.cost,
            createdDate: this.createdDate
        }
        return ret;
    }

    adjustQuantity(amount) {
        const newQuantity = this.quantity + amount;
        if (newQuantity < 0) {
            throw new Error("Quantity cannot be negative");
        }
        this.quantity = newQuantity;
    }
}

module.exports = { inventoryItem };