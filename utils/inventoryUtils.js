function calculateInventoryValue(inventory) {
  let sum = 0;
  for (const item of inventory) {
    sum += Number(item.cost);
  }
  return sum.toFixed(2); // adds padding/format to 2 decimal places
}

// Function to sort inventory items by category (primary) and storage location (secondary)
// Learnt from: 
// 1) https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort 
// 2) https://stackoverflow.com/questions/9175268/javascript-sort-function-sort-by-first-then-by-second
function sortInventoryByCategoryAndStorage(inventory) {
  return inventory.sort((firstItem, secondItem) => {
    // First sort by category (alphabetical)
    if (firstItem.category < secondItem.category) {
      return -1;
    } else if (firstItem.category > secondItem.category) {
      return 1;

      // If categories are equal, sort by storage location
    } else {
        if (firstItem.location < secondItem.location) {
          return -1;
        } else if (firstItem.location > secondItem.location) {
          return 1;
        }
      }
    }
  )
}


module.exports = { calculateInventoryValue, sortInventoryByCategoryAndStorage };