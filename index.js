import express from "express";
import dotenv from "dotenv"; // Correct way to import dotenv in ES6 modules
console.log("1")
dotenv.config(); // Initialize dotenv

const app = express();
const port = process.env.PORT;

import './src/config/connection.js'; // Ensure the path is correct
import mainRouter from "./src/modules/index.js"; // Use default import for ES6 module

// App listens to the port
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});

// Testing API
app.get("/test", (req, res) => {
  res.send("This Is For Testing Purpase");
});

// Routes
app.use("/api", mainRouter); // Mount mainRouter under /api prefix
