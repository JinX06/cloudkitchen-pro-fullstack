const express = require("express")
const router = express.Router()
const { calculateInventoryValue } = require("../../utils/inventoryUtils.js")

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

    if (itemID) {
        selected = list.find(it => it.itemID === itemID) || null;
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

module.exports = router