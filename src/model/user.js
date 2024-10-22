const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    
    username:{
      type: String,
      required: true,
      unique: true
    },

    email: {
      type: String,
      required: true,
      trim: true,
      unique: true, // Ensures that each email is unique in the collection
    },

    mobile: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: Number,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "USER",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isPending: {
      type: String,
      enum: ["Pending", "Approved","Reject"],
      default: "Pending", 
    },
    isBlock: {
      type: String,
      enum: ["Yes", "No"],
      default: "No", 
    },
    isDeleted:{
      type: Boolean,
      default: false,
    },
    permissions:{
      type:[String],
      default:[]
    },
    lastActive: { type: Date, default: Date.now }, 
    status: { type: String, enum: ['active', 'inactive'], default: 'inactive' }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
