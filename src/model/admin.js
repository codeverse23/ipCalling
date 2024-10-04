const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    trim: true,
    unique: true // Ensures that each email is unique in the collection
  },
  mobile: { 
    type: String, 
    required: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  otp:{
    type:String
  },
  role:{
    type:String
  },
  isBlock:{
    type:Boolean,
    default:false
  },
  permissions: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.model("Admin", adminSchema);

