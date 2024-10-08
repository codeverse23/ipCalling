const express = require("express");
const userRouter = express.Router();
const userController = require("../controller/userController");
const verifyRoles = require("../../middlewares/verifyRoles");
const roleList = require("../../src/consts/autho");
const { varifyToken } = require("../helper/varifyTokenFn");

userRouter.post("/signUp", userController.signUp);
userRouter.post("/varifyOtp", userController.varifyOtp);
userRouter.post("/sendOtp", userController.forgotPasswordSendOtp);
userRouter.put("/forgotChangePassword", userController.forgotChangePassword);
userRouter.post("/login", userController.login);
userRouter.put(
  "/changPassword",
  varifyToken,
  userController.changPassword
);

module.exports = userRouter;
