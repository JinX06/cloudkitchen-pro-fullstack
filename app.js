const express = require("express");
const ejs = require("ejs");
const morgan = require("morgan")
const path = require("path");
const app = express();

// Set the port number
const port_number = 8080;

// Set the view engine to EJS
app.set("view engine", "ejs");
app.engine("html", ejs.renderFile);

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

// Temporary page for testing different routes using ejs (will be removed later)
app.get("/", (req, res) => {
    const routes = [
        { url: "/home-34076352", label: "Home" },
        { url: "/not-found-34076352", label: "404" },
        { url: "/recipes-34076352", label: "Recipes" }
    ];

    res.render("temp.html", { routes });
});

app.get("/home-34076352", (req, res) =>{
    res.render("index.html");
});

app.get("/not-found-34076352", (req, res) => {
    res.status(404).render("404.html");
});

app.get("/recipes-34076352", (req, res) => {
    res.render("recipes.html");
});

app.listen(port_number, () => {
    console.log(`Server is running on http://localhost:${port_number}`);
});