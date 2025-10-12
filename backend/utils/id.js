const Counter = require("../models/Counter");

function prefixFor(pre) {
  if (pre === "user") {
    return "U-";
  } else if (pre === "recipe") {
    return "R-";
  } else if (pre === "inventory") {
    return "I-";
  } else {
    throw new Error(`Unknown id prefix: ${pre}`);
  }
}

// Peek the next ID string without incrementing the counter.
async function peekNextID(pre) {
  const counterId = `${pre}_id`;
  const doc = await Counter.findById(counterId);
  
  let nextnumber;
  if (doc && typeof doc.number === "number") {
    nextnumber = doc.number + 1;
  } else {
    // If this is the first ID, start at 1.
    nextnumber = 1;
  
  }
  const prefix = prefixFor(pre);
  return `${prefix}${String(nextnumber).padStart(5, "0")}`;
}

// Increment the ID counter for next use.
async function incrementID(pre) {
  const counterId = `${pre}_id`;
  await Counter.updateOne(
    { _id: counterId },
    { $inc: { number: 1 } },
    { upsert: true }
    // Source: https://www.geeksforgeeks.org/mongodb/upsert-in-mongodb/
    // upsert option creates the document if it does not exist
  );
}

module.exports = { peekNextID, incrementID };
