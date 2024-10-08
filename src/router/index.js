const express =require("express");
const router =express.Router();
const adminRouter = require("./adminRouter");
const userRouter = require("./userRouter");
router.use("/adminRouter",adminRouter)
router.use("/userRouter",userRouter)
module.exports=router;