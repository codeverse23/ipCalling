const mongoose =require("mongoose");
const systemInfoSchema = new mongoose.Schema({
    name:{type:String}
},{
    timestamps:true
});

module.exports = new mongoose.model("systemInfo",systemInfoSchema)