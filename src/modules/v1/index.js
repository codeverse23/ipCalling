import express from "express"
const  versionOneRouter=express.Router();

versionOneRouter.use("/admin",adminRouter);
export { versionOneRouter };