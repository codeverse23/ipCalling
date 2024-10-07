const express = require("express");
const app = express();
const port = 9000;
const router = require("./src/router/index");
require("./src/config/connection");
const mongoose = require("mongoose");
const cors = require("cors");  // Import the CORS middleware

// Enable CORS for all routes and origins
app.use(cors());

async function connectDB() {
    try {
        await mongoose.connect("mongodb+srv://bksb075:6R9TiltpuMHOnqGD@cluster0.4fq9c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Mongo Connected");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}

// Call the async function to connect to the DB
connectDB();

// Middleware for parsing JSON bodies
app.use(express.json());

// Define your routes
app.use("/api/v1", router);

// Test route
app.get("/", (req, res) => {
    res.send("This is for testing purposes");
});

// Start the server
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
