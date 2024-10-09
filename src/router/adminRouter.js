const express = require("express");
const adminRouter = express.Router();
const adminController = require("../controller/adminController");
const { varifyToken } = require("../helper/varifyTokenFn");
const multer = require('multer');
const path = require('path');
const verifyRoles = require("../../middlewares/verifyRoles");
const roleList = require("../../src/consts/autho");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,"../../upload")); // 'uploads/' folder mein files store hongi
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()); // File ka naam unique banane ke liye
    }
});
const upload = multer({ storage: storage });


adminRouter.post("/login", adminController.login);
adminRouter.get("/userList", varifyToken, adminController.userList)
adminRouter.delete("/deleteUser", varifyToken, adminController.deleteUser)
adminRouter.patch("/blockUnblockUser", varifyToken, adminController.blockUnblockUser)
adminRouter.get("/adminProfile", varifyToken, verifyRoles(roleList.ADMIN), adminController.adminProfile);


adminRouter.post("/changPassword", adminController.changPassword);
adminRouter.post("/SendOtp", adminController.forgotPasswordSendOtp);
adminRouter.post("/varifyOtp", adminController.varifyOtp);

adminRouter.post("/addSubAdmin", varifyToken, adminController.addSubAdmin)


adminRouter.post("/addNotification", varifyToken, adminController.addNotification);
adminRouter.post("/addPermissions", varifyToken, adminController.addPermissions)
adminRouter.put("/removePermissions", varifyToken, adminController.removePermissions)
adminRouter.put("/changSubAdminPassword", varifyToken, adminController.changSubAdminPassword)
adminRouter.put("/changSubAdminPassword", varifyToken, adminController.changSubAdminPassword)
adminRouter.put("/updateSubAdminProfile", varifyToken, adminController.updateSubAdminProfile)
adminRouter.get("/getSubAdminPermissions", varifyToken, adminController.getSubAdminPermissions)
adminRouter.post("/addRole", varifyToken, adminController.addRole);

adminRouter.put("/updateNotification", varifyToken, adminController.updateNotification);
adminRouter.delete("/deleteNotification", varifyToken, adminController.deleteNotification);
adminRouter.put("/updateAdminProfile",varifyToken,upload.single('file'),adminController.updateAdminProfile);
adminRouter.get("/notificationList", varifyToken, adminController.notificationList);
adminRouter.post("/addSystemInfo", varifyToken, adminController.addSystemInfo)
adminRouter.get("/systemInfoList", varifyToken, adminController.systemInfoList)
adminRouter.delete("/deleteSytemInfo", varifyToken, adminController.deleteSytemInfo);



module.exports = adminRouter;
