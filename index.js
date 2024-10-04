const express = require("express");
const app = express();
const port = 5000;
const router = require("./src/router/index")
require("./src/config/connection");
const mongoose =require("mongoose")
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

app.listen(port, () => {
    console.log(`app is listinging the port ${port}`)
});

app.get("/", (req, res) => {
    res.send("this is for the testing perpose")
});

app.use(express.json());
app.use("/api/v1",router)

