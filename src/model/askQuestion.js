const mongoose =require("mongoose");

const policySchema =new mongoose.Schema({
    question:{
        type:String,
        require:true
    },
    ans:{
        type:String,
        require:true
    }
},{timestamps:true});

module.exports=new mongoose.model("privacyPolicy",policySchema);