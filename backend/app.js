//import required modules
const express = require("express");
const ejs = require("ejs");
const morgan = require("morgan")
const path = require("path");

const app = express();
const { connectToMongoDB } = require("./db/connection");
const { attachCurrentUser } = require("./middleware/auth");

// Set the port number
const port_number = 8080;

// Set the view engine to EJS
app.set("view engine", "ejs");
app.engine("html", ejs.renderFile);

// App locals
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

// For POST requests - parse the body to json and urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// Use Bootstrap css from node_modules instead of CDNs so html can reference bootstrap css
app.use("/bootstrap", express.static(path.join(__dirname, "node_modules", "bootstrap", "dist")));

// Serve static files from the public/images directory
app.use("/images", express.static(path.join(__dirname, "public", "images")));

// Attach current user from query string (if any)
app.use(attachCurrentUser);

// ================== Routes ==================

app.use(require(path.join(__dirname, "routes/api/auth")))
app.use(require(path.join(__dirname, "routes/api/home")))
app.use(require(path.join(__dirname, "routes/api/recipe")))
app.use(require(path.join(__dirname, "routes/api/inventory")))
// app.use(require(path.join(__dirname, "routes/api/hd")))

// ============ Error Handling Middleware ============

app.use((req, res) => {
    res.status(404).json({ error: 'Not found' })
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message || 'Server error' })
});

// Connect to MongoDB and start server
async function startServer() {
    try {
        await connectToMongoDB();
        app.listen(port_number, () => {
            console.log(`Server is running on http://localhost:${port_number}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();