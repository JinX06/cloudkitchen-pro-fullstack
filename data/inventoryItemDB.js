const { inventoryItem } = require("../models/inventoryItem");

const inventoryItem1 = new inventoryItem(
    "OngJinXiang-34076352",
    "Fresh Tomatoes",
    8,
    "pieces",
    "Vegetables",
    "2025-07-18",
    "2025-07-25",
    "Fridge",
    6.40,
)

const inventoryItem2 = new inventoryItem(
    "OngJinXiang-34076352",
     "Spaghetti Pasta",
    2,
    "kg",
    "Grains",
    "2025-07-15",
    "2025-12-15",
    "Pantry",
    8.90,
)

const inventoryItemDB = [
    inventoryItem1,
    inventoryItem2
];

module.exports = {
    inventoryItemDB
};