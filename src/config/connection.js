import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();  // Correct way to configure dotenv

const { MONGODBURI } = process.env;  // Access MONGODBURI from process.env

console.log("1");

const db = mongoose.connect(MONGODBURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log("ERROR:", err);
  });

export default db;  // Use ES6 export


