const express =require("express");
const router =express.Router();
const adminController = require("../controller/adminController");
const adminRouter = require("./adminRouter");

router.use("/adminRouter",adminRouter)
module.exports=router;