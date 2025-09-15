const express = require("express");
const ejs = require("ejs");
const morgan = require("morgan")
const path = require("path");
const app = express();
const { connectToMongoDB } = require('./db/connection');
const { attachCurrentUser } = require('./middleware/auth');

// Set the port number
const port_number = 8080;

// Set the view engine to EJS
app.set("view engine", "ejs");
app.engine("html", ejs.renderFile);

// App locals (ask if can use list as this is a HD+++ task in AS1 just not maintained for AS2)
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

// Attach current user from query string (if any)
app.use(attachCurrentUser);

// ================== Routes ==================

app.get("/", (req, res) => {
    res.redirect("/welcome-34076352")
});

app.use("/", require(path.join(__dirname, "routes/pages/auth")));
app.use("/", require(path.join(__dirname, "routes/pages/welcome")));
app.use("/", require(path.join(__dirname, "routes/pages/home")));

app.use("/", require(path.join(__dirname, "routes/pages/recipe")));
app.use("/api", require(path.join(__dirname, "routes/api/recipe")))

app.use("/", require(path.join(__dirname, "routes/pages/inventory")));
app.use("/api", require(path.join(__dirname, "routes/api/inventory")))

app.use("/", require("./routes/pages/errors"));

// ============ Error Handling Middleware ============
app.use((req, res, next) => {
    console.log(`404 Error: ${req.method} ${req.originalUrl} not found`);
    res.status(404).render("404.html");
});

app.use((err, req, res, next) => {
    console.error("Error:", err.message);
    const status = err.status || 500;
    res.status(status).render("error.html", {
        code: status,
        message: status === 500 ? "Something went wrong on our end." : err.message,
    });
});

// Connect to MongoDB and start server
async function startServer() {
    try {
        await connectToMongoDB();
        app.listen(port_number, () => {
            console.log(`Server is running on http://localhost:${port_number}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();