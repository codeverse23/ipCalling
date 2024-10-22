const express = require("express");
const adminRouter = express.Router();
const adminController = require("../controller/adminController");
const { varifyToken } = require("../helper/varifyTokenFn");
const multer = require("multer");
const path = require("path");
const verifyRoles = require("../../middlewares/verifyRoles");
const roleList = require("../../src/consts/autho");
const getMulterStorage = require("../helper/fileUpload");
const uploadSingle = getMulterStorage("groupImage").single("groupImage"); 
adminRouter.post("/login", adminController.login);
adminRouter.get("/userList", varifyToken, adminController.userList);
adminRouter.delete("/deleteUser", varifyToken, adminController.deleteUser);
adminRouter.patch(
  "/blockUnblockUser",
  varifyToken,
  adminController.blockUnblockUser
);
adminRouter.get(
  "/adminProfile",
  varifyToken,
  verifyRoles(roleList.ADMIN),
  adminController.adminProfile
);

adminRouter.get(
  "/totalActiveUser",
  varifyToken,
  verifyRoles(roleList.ADMIN),
  adminController.totalActiveUser
);

adminRouter.get(
  "/totalDeactiveUser",
  varifyToken,
  verifyRoles(roleList.ADMIN),
  adminController.totalDeactiveUser
);

adminRouter.get(
  "/totalPendingReq",
  varifyToken,
  verifyRoles(roleList.ADMIN),
  adminController.totalPendingReq
);

adminRouter.get(
  "/blockUserList",
  varifyToken,
  verifyRoles(roleList.ADMIN),
  adminController.blockUserList
);



adminRouter.get(
  "/deshboardCount",
  varifyToken,
  verifyRoles(roleList.ADMIN),
  adminController.deshboardCount
);
adminRouter.post("/changPassword", adminController.changPassword);
adminRouter.post("/SendOtp", adminController.forgotPasswordSendOtp);
adminRouter.post("/varifyOtp", adminController.varifyOtp);

adminRouter.post("/addUser", varifyToken, adminController.addUser);

adminRouter.post(
  "/addNotification",
  varifyToken,
  adminController.addNotification
);
adminRouter.put(
  "/addPermissions",
  varifyToken,
  adminController.addPermissions
);
adminRouter.put(
  "/removePermissions",
  varifyToken,
  adminController.removePermissions
);
adminRouter.put(
  "/changSubAdminPassword",
  varifyToken,
  adminController.changSubAdminPassword
);
adminRouter.put(
  "/changSubAdminPassword",
  varifyToken,
  adminController.changSubAdminPassword
);
adminRouter.put(
  "/updateSubAdminProfile",
  varifyToken,
  adminController.updateSubAdminProfile
);
adminRouter.get(
  "/getSubAdminPermissions",
  varifyToken,
  adminController.getSubAdminPermissions
);
adminRouter.post("/addRole", varifyToken, adminController.addRole);

adminRouter.put(
  "/updateNotification",
  varifyToken,
  adminController.updateNotification
);

adminRouter.delete(
  "/deleteNotification",
  varifyToken,
  adminController.deleteNotification
);

adminRouter.put(
  "/updateAdminProfile",
  varifyToken,
  uploadSingle, // Corrected from upload.single("file") to uploadSingle
  adminController.updateAdminProfile
);

adminRouter.get(
  "/notificationList",
  varifyToken,
  adminController.notificationList
);
adminRouter.post("/addSystemInfo", varifyToken, adminController.addSystemInfo);
adminRouter.get("/systemInfoList", varifyToken, adminController.systemInfoList);

adminRouter.delete(
  "/deleteSytemInfo",
  varifyToken,
  adminController.deleteSytemInfo
);

adminRouter.post(
  "/addprivecyPolicy",
  varifyToken,
  verifyRoles(roleList.ADMIN),
  adminController.addprivecyPolicy
);

adminRouter.put(
  "/updatePrivecyPolicy",
  varifyToken,
  verifyRoles(roleList.ADMIN),
  adminController.updatePrivecyPolicy
);

adminRouter.post(
  "/addtermCondition",
  varifyToken,
  verifyRoles(roleList.ADMIN),
  adminController.addtermCondition
);

adminRouter.put(
  "/updateTermCondition",
  varifyToken,
  verifyRoles(roleList.ADMIN),
  adminController.addtermCondition
);

adminRouter.post(
  "/addQusAns",
  varifyToken,
  verifyRoles(roleList.ADMIN),
  adminController.addQusAns
);

adminRouter.put(
  "/updateQusAns",
  varifyToken,
  verifyRoles(roleList.ADMIN),
  adminController.updateQusAns
);

adminRouter.delete(
  "/deleteQusAns",
  varifyToken,
  adminController.deleteQusAns
);


adminRouter.post(
  "/createGroup",
  varifyToken,
  uploadSingle,
  adminController.createGroup
);

adminRouter.post(
  "/addMembers",
  varifyToken,
  adminController.addMembers
);

adminRouter.post(
  "/getGroupInfo",
  varifyToken,
  adminController.getGroupInfo
);

adminRouter.delete(
  "/deleteGroup",
  varifyToken,
  adminController.deleteGroup
);

adminRouter.delete(
  "/deleteUserGroup",
  varifyToken,
  adminController.deleteUserGroup
);

adminRouter.put(
  "/userAcceptReject",
  varifyToken,
  verifyRoles(roleList.ADMIN),
  adminController.userAcceptReject
);
module.exports = adminRouter;
