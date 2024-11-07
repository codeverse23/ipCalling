const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true, // It's a good idea to make this required
    },
    adminId: {
      type: String,
      required: true, // Assuming you want the admin to be required
    },
    members: {
      type: [String], // Array of strings for member IDs
      required: true, // Make it required if members are necessary
    },
    groupImage: {
      type: String, // Assuming you store the image URL or path
      required: true, // Required image URL/path
    },
    lastMessage: {
      type: String,
      default: "", // Default empty string if no message is set
    },
    lastMessageTime: {
      type: Date,
      default: Date.now, // Default to current timestamp
    },
  },
  {
    timestamps: true, // Mongoose will automatically add createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Group", groupSchema);
