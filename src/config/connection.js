const mongoose = require("mongoose");

// MongoDB connection URI
const uri = "mongodb+srv://bksb075:6R9TiltpuMHOnqGD@cluster0.4fq9c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("MongoDB connected successfully");
})
.catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

// Export mongoose to use elsewhere in the app
module.exports = mongoose;
