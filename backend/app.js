//import required modules
const express = require("express");
const morgan = require("morgan")
const path = require("path");
const cors = require("cors")

const app = express();
const { connectToMongoDB } = require("./db/connection");
const { attachCurrentUser } = require("./middleware/auth");

//import routers
const authRouter = require("./routes/api/auth");
const homeRouter = require("./routes/api/home");
const recipeRouter = require("./routes/api/recipe");
const inventoryRouter = require("./routes/api/inventory");

// Set the port number
const port_number = 8080;

// App locals
app.locals.suggestedRecipes = [];

// ================ Middleware ================

// Log requests to the console
app.use(morgan("dev")); 
// app.use(morgan("tiny"));

// For POST requests - parse the body to json and urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// Attach current user from query string (if any)
app.use(attachCurrentUser);

// ================== Routes ==================

app.use("/api", authRouter);
app.use("/api", homeRouter);
app.use("/api", recipeRouter)
app.use("/api", inventoryRouter)
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