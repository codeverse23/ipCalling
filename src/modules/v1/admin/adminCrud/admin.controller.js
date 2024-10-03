const adminLogin = async(req,res)=>{
    try{
        const {email,password} =req.body;
        const details =await admin.findOne("Admin",{email:email});
        console.log(details,"hhhhh");
        
        if(!details) return 
    }catch(err){
    
    }
}

