const mongoose =require("mongoose")
const groupSchema = new mongoose.Schema({
  groupName: String,
  adminId: String,
  members: [String],
},{
    timestamps:true
});
module.exports = new mongoose.model("group",groupSchema)