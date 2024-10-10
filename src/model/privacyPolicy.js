const mongoose =require("mongoose");

const policySchema =new mongoose.Schema({
    policyMessage:{
        type:String,
        require:true
    }
},{timestamps:true});

module.exports=new mongoose.model("privacyPolicy",policySchema);
