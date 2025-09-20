const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema({
  inventoryId: {
    type: String,
    required: true,
    unique: true,
    match: [/^I-\d{5}$/, "Inventory ID must follow the format I-00000"],
  },
  userId: {
    type: String,
    ref: "User",
    required: true,
    match: [/^U-\d{5}$/, "User ID must follow the format U-00000"],
  },
  
  ingredientName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
    match: /^[A-Za-z][A-Za-z\s\-"]{1,49}$/
  
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: [0.000001, "Quantity must be greater than 0"], 
    max: [9999, "Quantity must be <= 9999"] 
  },

  unit: {
    type: String,
    required: [true, "Unit must be exactly one of: 'pieces', 'kg', 'g', 'liters', 'ml', 'cups', 'tbsp', 'tsp', 'dozen'"],
    enum: {
      values: ["pieces", "kg", "g", "liters", "ml", "cups", "tbsp", "tsp", "dozen"],
      message: "Unit must be exactly one of: 'pieces', 'kg', 'g', 'liters', 'ml', 'cups', 'tbsp', 'tsp', 'dozen'"
    }
  },

  category: { 
    type: String, 
    enum: { 
      values: ["Vegetables","Fruits","Meat","Dairy","Grains","Spices","Beverages","Frozen","Canned","Other"], 
      message: "Category must be exactly one of: 'Vegetables', 'Fruits', 'Meat', 'Dairy', 'Grains', 'Spices', 'Beverages', 'Frozen', 'Canned', 'Other'" 
    },
    required: true 
  },

  purchaseDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(date) {
        const date_given = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const today = new Date();
        // Set time to midnight for accurate comparison
        today.setHours(0, 0, 0, 0);
        return date_given <= today;
      },
      message: "purchaseDate cannot be in the future"
    }
  },
  expirationDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        if (!value || !this.purchaseDate) {
          return true;
        } // findOneAndUpdate validation runs before purchaseDate is attached to the query, so use controller-level check

        return value > this.purchaseDate;
      },
      message: "expirationDate must be after purchaseDate"
    }
  },
  location: { 
    type: String, 
    enum: { 
      values: ["Fridge","Freezer","Pantry","Counter","Cupboard"], 
      message: 'Location must be one of: "Fridge", "Freezer", "Pantry", "Counter", "Cupboard"' 
    }, 
    required: true 
  },
  cost: {
    type: Number,
    required: true,
    min: [0.01, "Cost must be at least 0.01"],
    max: [999.99, "Cost must be at most 999.99"],
    validate: {
      validator: function(cost) {
        return Number.isFinite(cost) && Math.round(cost * 100) === cost * 100;
      },
      message: "cost must have max 2 decimal places",
    },
  },
}, { timestamps: true }); // use mongoose createdAt, updatedAt timestamps

InventorySchema.index({ inventoryId: 1 }, { unique: true });
InventorySchema.index({ userId: 1 });

module.exports = mongoose.model("Inventory", InventorySchema);
