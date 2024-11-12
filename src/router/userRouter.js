const express = require("express");
const userRouter = express.Router();
const userController = require("../controller/userController");
const verifyRoles = require("../../middlewares/verifyRoles");
const roleList = require("../../src/consts/autho");
const { varifyToken } = require("../helper/varifyTokenFn");

userRouter.post("/signUp", userController.signUp);
userRouter.post("/checkUsername", userController.checkUsername);
userRouter.post("/varifyOtp", userController.varifyOtp);
userRouter.post("/sendOtp", userController.forgotPasswordSendOtp);
userRouter.put("/forgotChangePassword", userController.forgotChangePassword);
userRouter.post("/login", userController.login);
userRouter.put(
  "/changPassword",
  varifyToken,
  verifyRoles(roleList.USER),
  userController.changPassword
);

userRouter.put(
  "/changEmail",
  varifyToken,
  verifyRoles(roleList.USER),
  userController.changEmail
);

userRouter.put(
  "/updateUsername",
  varifyToken,
  userController.updateUsername
);

userRouter.post(
  "/privacyPolicyList",
  varifyToken,
  userController.privacyPolicyList
);

userRouter.post(
  "/termConditionList",
  varifyToken,
  userController.termConditionList
);

userRouter.post(
  "/privecyInfo",
  varifyToken,
  userController.privecyInfo
);

userRouter.put(
  "/updatePrivecyInfo",
  varifyToken,
  userController.updatePrivecyInfo
);


userRouter.post(
  "/genrateToken",
  userController.genrateToken
);


userRouter.get(
  "/getProfile",
  varifyToken,
  userController.getProfile
);

userRouter.put(
  "/updateProfileImage",
  varifyToken,
  userController.updateProfileImage
);

userRouter.get("/userList", varifyToken, userController.userList);
module.exports = userRouter;
