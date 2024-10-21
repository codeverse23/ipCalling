const mongoose =require("mongoose")
const groupSchema = new mongoose.Schema({
  groupName: String,
  adminId: String,
  members: [String],
  groupImage: {
    type: String, // Assuming you store the image URL or path
    required: true // Adjust as needed
},
},{
    timestamps:true
});
module.exports = new mongoose.model("group",groupSchema)