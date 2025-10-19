require('dotenv').config();

//import required modules
const express = require("express");
const morgan = require("morgan")
const path = require("path");
const cors = require("cors")
const fs = require("fs");
const textToSpeech = require("@google-cloud/text-to-speech");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { connectToMongoDB } = require("./db/connection");
const { attachCurrentUser } = require("./middleware/auth");

//import routers
const authRouter = require("./routes/api/auth");
const homeRouter = require("./routes/api/home");
const recipeRouter = require("./routes/api/recipe");
const inventoryRouter = require("./routes/api/inventory");
const aiRouter = require("./routes/api/ai");
const translateRouter = require("./routes/api/translate");

// Set the port number
const port_number = 8080;

// App locals
app.locals.suggestedRecipes = [];

const ttsClient = new textToSpeech.TextToSpeechClient( {keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS} );
// ================ Middleware ================


// Log requests to the console
app.use(morgan("dev")); 

// For POST requests - parse the body to json and urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// Attach current user from query string (if any)
app.use(attachCurrentUser);

// ================== Routes ==================
app.use(express.static("../dist/cloudkitchen-pro/browser"));
app.use("/audio", express.static(path.join(__dirname, "public/audio")));

app.use("/api", authRouter);
app.use("/api", homeRouter);
app.use("/api", recipeRouter)
app.use("/api", inventoryRouter)
app.use("/api", aiRouter)
app.use("/api", translateRouter)

// Serve the frontend for any non-API routes
app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '../dist/cloudkitchen-pro/browser/index.html'));
    } else {
        next();
    }
});

// ============ Error Handling Middleware ============

app.use((req, res) => {
    res.status(404).json({ error: 'Not found' })
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message || 'Server error' })
});

io.on("connection", (socket) => {
    socket.on("request", (payload = {}) => {
        const text = String(payload.text || "").trim();
        const request = {
            input: { text },
            voice: { languageCode: "en-US", name: "en-US-Chirp3-HD-Charon" },
            audioConfig: { audioEncoding: "MP3" }
        };

        ttsClient.synthesizeSpeech(request, (err, response) => {
            if (err) {
                console.error("TTS failed:", err);
                socket.emit("result", { error: "TTS unavailable" });
                return;
            }

            try {
                const audioDir = path.join(__dirname, "public", "audio");
                const filename = `tts${Date.now()}.mp3`;
                const filePath = path.join(audioDir, filename);

                fs.writeFile(filePath, response.audioContent, "binary", (err) => {
                    if (err) {
                        console.log("Unable to save TTS audio:", err);
                        socket.emit("result", { error: "TTS unavailable" });
                        return;
                    }
                    socket.emit("result", { url: `/audio/${filename}` });
                });
            } catch (fileErr) {
                console.error("Unable to prepare audio directory:", fileErr);
                socket.emit("result", { error: "TTS unavailable" });
            }
        });
    });
});

// Connect to MongoDB and start server
async function startServer() {
    try {
        await connectToMongoDB();
        server.listen(port_number, () => {
            console.log(`Server is running on http://localhost:${port_number}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();