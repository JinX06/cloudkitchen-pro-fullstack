function calculateInventoryValue(inventory) {
  let sum = 0;
  for (const item of inventory) {
    sum += Number(item.cost);
  }
  return sum.toFixed(2); // adds padding/format to 2 decimal places
}

module.exports = { calculateInventoryValue };