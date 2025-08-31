const express = require("express")
const router = express.Router()
const { calculateInventoryValue, uniqueCategoryList } = require("../../utils/inventoryUtils.js")

router.get("/inventory-34076352", (req, res) => {
    res.render("inventory/inventory.html", { 
        myInventory: req.app.locals.inventoryItemDB,
        inventoryValue: calculateInventoryValue(req.app.locals.inventoryItemDB)
    })
})

router.get("/inventory-add-34076352", (req, res) => {
    res.render("inventory/inventory-add.html")
})

router.get("/inventory-remove-34076352", (req, res) => {
    const list = req.app.locals.inventoryItemDB;
    const { itemID } = req.query;
    let selected = null;

    if (typeof itemID !== "undefined" && itemID !== "") {
        selected = list.find(it => it.itemID === itemID) || null;
        
        if (selected === null) {
            req.app.locals.errorOBJ = { status: 400, message: "Item not found." };
            return res.redirect("/error-34076352");
        }
    }


    res.render("inventory/inventory-remove.html", {
        myInventory: list,
        selectedItem: selected,
        selectedItemId: itemID
    });
})

router.get("/inventory-view-34076352", (req, res) => {
    const list = req.app.locals.inventoryItemDB;
    const { itemID } = req.query;
    let selected = null;

    if (itemID) {
        selected = list.find(it => it.itemID === itemID) || null;
    }

    res.render("inventory/inventory-view.html", {
        selectedItem: selected
    });
})




module.exports = router;

router.get("/inventory-alerts-34076352", (req, res) => {

    let expiringItems = [];
    for (const item of req.app.locals.inventoryItemDB) {
        if (item.daysLeft <= 3 && item.daysLeft > 0) { // Alert for items expiring in 3 days or less
        // if (false) {
            expiringItems.push(item);
        }
    }

    let lowStock = [];
    for (const item of req.app.locals.inventoryItemDB) {
        if (item.quantity < 2) {
            lowStock.push(item);
        }
    }

    const uniqueCategories = uniqueCategoryList(req.app.locals.inventoryItemDB);
    const categoryGroups = [];

    for (const category of uniqueCategories) {
        categoryGroups.push({
            category: category,
            itemCount: 0,
            value: 0
        });
    }

    // console.log(categoryGroups)

    for (const item of req.app.locals.inventoryItemDB) {
        const group = categoryGroups.find(g => g.category === item.category);
        if (group) {
            group.itemCount++;
            group.value += item.cost;
        }
    }

    // console.log(categoryGroups["Condiments"])


    res.render("inventory/inventory-alerts.html", {
        expiringItems: expiringItems,
        lowStock: lowStock,
        myInventoryValue: calculateInventoryValue(req.app.locals.inventoryItemDB),
        totalItems: req.app.locals.inventoryItemDB.length,
        categoryGroups: categoryGroups
    });
});

module.exports = router