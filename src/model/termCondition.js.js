const mongoose =require("mongoose");

const termConditionSchema =new mongoose.Schema({
    termConditionMessage:{
        type:String,
        require:true
    }
},{timestamps:true});

module.exports=new mongoose.model("termCondition",termConditionSchema);