function parseIngredient(ingredient) {
    let text = ingredient.trim();

    // refer to search and scale for more documentation
    // Case 1: mergedIngredient form (200g spaghetti)
    const mergedIngredient = text.match(/^(\d+(?:\.\d+)?)([a-zA-Z]+)(.*)$/);
    if (mergedIngredient) {
        const qty = parseFloat(mergedIngredient[1]);
        const unit = mergedIngredient[2];
        const item = mergedIngredient[3].trim();
        return { qty: qty, unit: unit, item: item };
    }

    // Case 2: spaceIngredient form (200 g spaghetti / 2 large eggs)
    const spaceIngredient = text.match(/^(\d+(?:\.\d+)?)(\s+)(.*)$/);
    if (spaceIngredient) {
        const qty = parseFloat(spaceIngredient[1]);
        const item = spaceIngredient[3].trim();
        return { qty: qty, unit: "", item: item };
    }

    // No number found, treat whole string as item (Soy sauce/Oil/Black Pepper ) 
    return { qty: 1, unit: "", item: text };
}

function findInventoryForItem(inventory, itemName) {
    for (const item of inventory) {
        if (item.ingredientName === itemName) {
            return item;
        }
    }
    return null;
}

function computeAvailability(recipe, inventory) {
    const available = [];
    const missing = [];

    for (const ingredient of recipe.ingredients) {
        const parsed = parseIngredient(ingredient);
        const inv = findInventoryForItem(inventory, parsed.item);

        if (inv) {
            available.push({
                display: ingredient,
                matchName: inv.ingredientName,
                invQty: inv.quantity,
                invUnit: inv.unit
            });
        } else {
            missing.push({ display: ingredient });
        }
    }

    const total = (recipe.ingredients).length;
    let percent = 0;
    if (total > 0) {
        percent = Math.round((available.length / total) * 100);
    }

    return {
        available: available,
        missing: missing,
        recipeSteps: available.length,
        total: total,
        percent: percent
    };
}

module.exports = {
    parseIngredient,
    computeAvailability,
    findInventoryForItem
};
