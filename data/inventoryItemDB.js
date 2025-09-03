const { inventoryItem } = require("../models/inventoryItem");
const { sortInventoryByCategoryAndStorage } = require("../utils/inventoryUtils");

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
);

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
);

const inventoryItem3 = new inventoryItem(
    "OngJinXiang-34076352",
    "Chicken Breast",
    5,
    "pieces",
    "Meat",
    "2025-07-10",
    "2025-07-20",
    "Freezer",
    15.00,
);

const inventoryItem4 = new inventoryItem(
    "OngJinXiang-34076352",
    "Milk",
    3,
    "litres",
    "Dairy",
    "2025-07-12",
    "2025-07-19",
    "Fridge",
    7.50,
);

const inventoryItem5 = new inventoryItem(
    "OngJinXiang-34076352",
    "Rice",
    4,
    "kg",
    "Grains",
    "2025-07-05",
    "2026-01-05",
    "Pantry",
    12.00,
);

const inventoryItem6 = new inventoryItem(
    "OngJinXiang-34076352",
    "Cabbage",
    2,
    "kg",
    "Vegetables",
    "2025-07-01",
    "2026-07-01",
    "Freezer",
    5.20,
);

const inventoryItem7 = new inventoryItem(
    "OngJinXiang-34076352",
    "Cheese",
    1,
    "block",
    "Dairy",
    "2025-07-13",
    "2025-08-13",
    "Fridge",
    4.80,
);

const inventoryItem8 = new inventoryItem(
    "OngJinXiang-34076352",
    "Eggs",
    12,
    "pieces",
    "Dairy",
    "2025-07-14",
    "2025-07-28",
    "Fridge",
    6.00,
);

const inventoryItem9 = new inventoryItem(
    "OngJinXiang-34076352",
    "Olive Oil",
    1,
    "litre",
    "Condiments",
    "2025-07-02",
    "2026-07-02",
    "Pantry",
    10.00,
);

const inventoryItem10 = new inventoryItem(
    "OngJinXiang-34076352",
    "Apples",
    10,
    "pieces",
    "Fruits",
    "2025-07-11",
    "2025-07-21",
    "Fridge",
    9.00,
);

// for testing smart inventory alert (always < 3 days left)
const currentDate = new Date();
const expiryDate = new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days from now
const expiryString = expiryDate.toISOString().split("T")[0];

const inventoryItem11 = new inventoryItem(
    "OngJinXiang-34076352",
    "Apple Jam",
    1.5,
    "spoonful",
    "Fruits",
    "2025-07-09",
    expiryString,
    "Fridge",
    5.00,
);

const inventoryItemDB = [
    inventoryItem1,
    inventoryItem2,
    inventoryItem3,
    inventoryItem4,
    inventoryItem5,
    inventoryItem6,
    inventoryItem7,
    inventoryItem8,
    inventoryItem9,
    inventoryItem10,
    inventoryItem11
];

const sortedInventoryItemDB = sortInventoryByCategoryAndStorage(inventoryItemDB);

module.exports = {
    inventoryItemDB: sortedInventoryItemDB
};