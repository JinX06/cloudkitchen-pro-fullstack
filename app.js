const express = require("express");
const ejs = require("ejs");
const morgan = require("morgan")
const path = require("path");
const app = express();
const {recipeDB} = require("./data/recipeDB")
const {inventoryItemDB} = require("./data/inventoryItemDB")

// Set the port number
const port_number = 8080;

// Set the view engine to EJS
app.set("view engine", "ejs");
app.engine("html", ejs.renderFile);

// Make *.app.locals available as a "global" variable for routes to access
app.locals.recipeDB = recipeDB;
app.locals.inventoryItemDB = inventoryItemDB;

app.locals.errorOBJ = null;
app.locals.suggestedRecipes = [];

// Set Express to look for views in multiple directories
app.set("views", [
    path.join(__dirname, "views"), 
    path.join(__dirname, "views", "recipes"),
    path.join(__dirname, "views", "inventory")
]);

// ================ Middleware ================

// Log requests to the console
app.use(morgan("dev")); 
// app.use(morgan("tiny"));

// For POST requests
app.use(express.urlencoded({ extended: true }));

// Use Bootstrap css from node_modules instead of CDNs so html can reference bootstrap css
app.use("/bootstrap", express.static(path.join(__dirname, "node_modules", "bootstrap", "dist")));

// Serve static files from the public/images directory
app.use("/images", express.static(path.join(__dirname, "public", "images")));

// ================== Routes ==================

app.get("/", (req, res) => {
    res.redirect("/home-34076352")
});

app.use("/", require(path.join(__dirname, "routes/pages/home")));

app.use("/", require(path.join(__dirname, "routes/pages/recipe")));
app.use("/", require(path.join(__dirname, "routes/api/recipe")))

app.use("/", require(path.join(__dirname, "routes/pages/inventory")));
app.use("/", require(path.join(__dirname, "routes/api/inventory")))

app.use("/", require("./routes/pages/errors"));

app.listen(port_number, () => {
    console.log(`Server is running on http://localhost:${port_number}`);
});