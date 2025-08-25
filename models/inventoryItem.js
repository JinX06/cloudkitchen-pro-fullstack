class inventoryItem {
    static itemID = 1

    constructor(userId, ingredientName, quantity, unit, category, purchaseDate, expiryDate, location, cost) {
        this.itemID = `I-${String(inventoryItem.itemID).padStart(5, "0")}`;
        inventoryItem.itemID++;

        this.userId = userId
        this.ingredientName = ingredientName
        this.quantity = quantity
        this.unit = unit
        this.category = category
        this.purchaseDate = purchaseDate;
        this.expiryDate = expiryDate;
        this.location = location;
        this.cost = cost;

        this.dateObj = new Date(); // Format: "YYYY-MM-DDTHH:mm:ss.sssZ"
        this.createdDate = this.dateObj.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    }
}

module.exports = { inventoryItem };