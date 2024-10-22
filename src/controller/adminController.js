const { sendOtp } = require("../helper/email");
const { jwtToken } = require("../helper/jwt");
const admin = require("../model/admin");
const notification = require("../model/notification");
const system = require("../model/system");
const bcrypt = require("bcryptjs");
const user = require("../model/user");
const privacyPolicy = require("../model/privacyPolicy");
const termCondition = require("../model/termCondition.js");
const qusans = require("../model/askQuestion.js");
const { model } = require("mongoose");
const group = require("../model/group.js");

////////////////////////////admin crud/////////////////////////////////////////////
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const findAdmin = await user.findOne({ email: email });
    if (!findAdmin) {
      return res.json({
        statusCode: 400,
        status: false,
        message: "Admin Not Found",
      });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = password === findAdmin.password;
    if (!isMatch) {
      return res.json({
        statusCode: 400,
        status: false,
        message: "Please Enter the correct password",
      });
    }

    const role = findAdmin.role;
    // Generate JWT token
    const token = jwtToken(email, password, role); // Replace with your actual token generation logic

    // Update the lastActive and mark the user as active
    await user.findOneAndUpdate(
      { email: email },
      {
        lastActive: new Date(), // Set lastActive to current time
        status: "active", // Mark user as active
      }
    );

    return res.json({
      statusCode: 200,
      status: true,
      message: "Login Successfully",
      data: token,
    });
  } catch (err) {
    return res.json({
      statusCode: 400,
      status: false,
      message: err.message,
    });
  }
};

module.exports.userList = async (req, res) => {
  try {
    const adminId = req.query.adminId;
    const findAdmin = await user.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: true,
        message: "Admin Not Found",
        data: "",
      });
    }
    const list = await user.find(
      { role: "USER", isDeleted: false },
      { password: 0, __v: 0, role: 0, isVerified: 0, otp: 0 }
    );
    return res.json({
      status: true,
      statusCode: 200,
      message: "User List Shown Successfully",
      data: list,
    });
  } catch (err) {
    return res.json({
      status: true,
      message: "Internal Server Error",
      data: err.message,
    });
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const { adminId, userId } = req.body;
    const findAdmin = await user.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: true,
        statusCode: 400,
        message: "Admin Not Found",
      });
    }

    const findUser = await user.findOne({ _id: userId });
    if (!findUser) {
      return res.json({
        status: true,
        statusCode: 400,
        message: "User Not Found",
      });
    }

    await user.updateOne({ _id: userId }, { $set: { isDeleted: true } });
    return res.json({
      status: true,
      statuscode: 200,
      message: "User delete successfully",
    });
  } catch (err) {
    return res.json({
      status: false,
      statusCode: 400,
      message: err.message,
    });
  }
};

module.exports.adminProfile = async (req, res) => {
  try {
    const adminId = req.query.adminId;
    const findAdmin = await user.findOne({ _id: adminId });
    return res.json({
      statusCode: 200,
      status: true,
      message: "Admin Profile Shown Successfully",
      data: findAdmin,
    });
  } catch (err) {
    return res.json({
      statusCode: 400,
      status: false,
      message: "Internal Server Error",
      data: findAdmin,
    });
  }
};

module.exports.createNotification = async (req, res) => {
  try {
    const { adminId, title, message } = req.body;
    const findAdmin = await user.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        statusCode: 400,
        status: false,
        message: "Admin Not Found",
      });
    }
    const notificationObj = { title, message };
    await Notification.create(notificationObj);
    return res.json({
      statusCode: 200,
      status: true,
      message: "NOtification add successfully",
    });
  } catch (err) {
    return res.json({
      statusCode: 400,
      status: false,
      message: "Internal Server Error",
      data: findAdmin,
    });
  }
};

module.exports.blockUnblockUser = async (req, res) => {
  try {
    const { adminId, userId, isBlock } = req.body;

    // Check if the value is either "Yes" or "No"
    if (isBlock !== "Yes" && isBlock !== "No") {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Invalid value for isBlock. Must be 'Yes' or 'No'.",
      });
    }

    const findAdmin = await user.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Admin Not Found",
      });
    }

    const findUser = await user.findOne({ _id: userId });
    if (!findUser) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "User Not Found",
      });
    }

    // Update the user's isBlock status
    await user.updateOne({ _id: userId }, { isBlock: isBlock });

    // Send appropriate success message based on the isBlock value
    const message = isBlock === "Yes" 
      ? "User Blocked Successfully" 
      : "User Unblocked Successfully";

    return res.json({
      status: true,
      statusCode: 200,
      message: message,
    });
  } catch (err) {
    // Check if the error is due to Mongoose validation
    if (err.name === 'ValidationError') {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Invalid value for isBlock.",
      });
    }
    return res.json({
      status: false,
      statusCode: 400,
      message: err.message,
    });
  }
};

module.exports.addNotification = async (req, res) => {
  try {
    const { adminId, title, message } = req.body;
    const findAdmin = await user.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Admin Not Found",
      });
    }

    const addNotification = await notification.create({
      title,
      message,
    });
    return res.json({
      status: true,
      statusCode: 200,
      message: "Add notification successfully",
      data: addNotification,
    });
  } catch (err) {
    return res.json({
      status: false,
      statusCode: 400,
      message: err.message,
    });
  }
};

module.exports.changPassword = async (req, res) => {
  try {
    const { adminId, password, newPassword } = req.body;
    const findAdmin = await admin.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        statusCode: 400,
        status: fasle,
        message: "Admin Not Found",
        data: "",
      });
    }
    if (findAdmin.password === password) {
      const updatePassword = await admin.findOneAndUpdate(
        { _id: adminId },
        { $set: { password: newPassword } }
      );
      return res.json({
        status: 200,
        message: "New Password Update Successfully",
        data: "",
      });
    } else {
      return res.json({
        status: true,
        message: "please enter currect password",
        data: "",
      });
    }
  } catch (err) {
    return res.json({
      status: true,
      message: "Internal Server Error",
      data: err.message,
    });
  }
};

module.exports.updateAdminProfile = async (req, res) => {
  try {
    const { adminId, name, email, mobile } = req.file;
    const findAdmin = await admin.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: false,
        statusCode: 400,
        messase: "Admin Not Found",
      });
    }
    let updateObject = {};
    if (name) updateObject.name = name;
    if (email) updateObject.email = email;
    if (mobile) updateObject.mobile = mobile;

    await admin.updateOne({ _id: adminId }, { $set: updateObject });
    return res.json({
      status: true,
      statusCode: 200,
      message: "Admin profile Update successfully",
    });
  } catch (err) {
    return res.json({
      status: true,
      statusCode: 400,
      message: err.message,
    });
  }
};

module.exports.forgotPasswordSendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    //var otp = Math.floor(1000 + Math.random() * 9000);
    var otp = 12345;
    const findAdmin = await user.findOne({ email: email });
    if (!findAdmin) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Admin Not Found",
        data: "",
      });
    }
    const name = findAdmin.name;
    sendOtp(email, otp, name);
    await user.findOneAndUpdate({ _id: findAdmin._id }, { $set: { otp: otp } });
    return res.json({
      status: true,
      statusCode: 200,
      message: "mail send successfully",
      otp: otp,
    });
  } catch (err) {
    return res.json({
      status: true,
      message: "Internal Server Error",
      data: err.message,
    });
  }
};

module.exports.varifyOtp = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const findAdmin = await admin.findOne({ email: email });
    if (!findAdmin) {
      return res.json({
        status: true,
        message: "Admin Not Found",
        data: "",
      });
    }
    if (findAdmin.otp !== otp) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "please provide currect otp",
      });
    }
    await admin.findOneAndUpdate(
      { _id: findAdmin._id },
      { $set: { password: password } }
    );
    return res.json({
      status: true,
      statusCode: 200,
      message: "Password Change Successfully ",
    });
  } catch (err) {
    return res.json({
      status: true,
      message: "Internal Server Error",
      data: err.message,
    });
  }
};

module.exports.addUser = async (req, res) => {
  try {
    const { adminId, name, username, email, mobile, password } = req.body;
    const findAdmin = await user.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: true,
        message: "Admin Not Found",
        data: "",
      });
    }
    const findUser = await user.findOne({ email });
    if (findUser) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "this Email is already is use please use another email",
      });
    }
    await user.insertMany({
      name: name,
      username,
      email: email,
      mobile: mobile,
      password: password,
    });
    console.log("3");
    return res.json({
      status: true,
      statusCode: 200,
      message: "User Add Successfully",
    });
  } catch (err) {
    return res.json({
      status: true,
      message: err.message,
    });
  }
};

module.exports.subAdminUnblock = async (req, res) => {
  try {
    const { adminId, subAdminId, isBlock } = req.body;
    const findAdmin = await admin.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Admin Not found",
      });
    }
    const findSubAdmin = await admin.findOne({ _id: subAdminId });
    if (!findSubAdmin) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Sub Admin Not found",
      });
    }

    await admin.updateOne({ _id: subAdminId }, { isBlock: isBlock });
    return res.json({
      status: false,
      statusCode: 400,
      message: "sub admin unBlock successfully",
    });
  } catch (err) {
    return res.json({
      status: false,
      statusCode: 400,
      message: err.message,
    });
  }
};

module.exports.updateSubProfile = async (req, res) => {
  try {
    const { adminId, subAdminId, name, email, mobile, password } = req.body;
    const findAdmin = await admin.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Admin Not Found",
      });
    }
    await admin.deleteOne({ _id: subAdminId });
    return res.json({
      status: true,
      statuscode: 200,
      message: "subAdmin delete successfully",
    });
  } catch (err) {
    return res.json({
      status: false,
      statusCode: 400,
      message: err.message,
    });
  }
};

module.exports.addPermissions = async (req, res) => {
  try {
    const { adminId, userId, permissions } = req.body;
    const findAdmin = await user.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Admin not found",
      });
    }

    const subAdmin = await user.findOne({ _id: userId });

    if (!subAdmin) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "User Id Not Found",
      });
    }

    await user.updateOne(
      { _id: userId },
      { $set: { permissions: permissions } }
    );
    return res.json({
      status: true,
      statusCode: 200,
      message: "User Permissions Add successfully",
    });
  } catch (err) {
    return res.json({
      status: true,
      statusCode: 400,
      message: err.message,
    });
  }
};

module.exports.removePermissions = async (req, res) => {
  try {
    const { adminId, userId, permissions } = req.body;

    const findAdmin = await user.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Admin not found",
      });
    }

    const findUser = await user.findOne({ _id: userId });

    if (!findUser) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "User Not found",
      });
    }

    await user.updateOne(
      { _id: userId },
      { $set: { permissions: permissions } }
    );
    return res.json({
      status: true,
      statusCode: 200,
      message: "User Permition Remove successfully",
    });
  } catch (err) {
    return res.json({
      status: true,
      statusCode: 400,
      message: err.message,
    });
  }
};

module.exports.changSubAdminPassword = async (req, res) => {
  try {
    const { adminId, subAdminId, password } = req.body;

    const findAdmin = await admin.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Admin not found",
      });
    }

    const subAdmin = await admin.findOne({ _id: subAdminId });
    if (!subAdmin) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Sub admin Not found",
      });
    }

    await admin.updateOne(
      { _id: subAdminId },
      { $set: { password: password } }
    );
    return res.json({
      status: true,
      statusCode: 200,
      message: "Sub admin Password Change successfully",
    });
  } catch (err) {
    return res.json({
      status: true,
      statusCode: 400,
      message: err.message,
    });
  }
};

module.exports.updateSubAdminProfile = async (req, res) => {
  try {
    const { adminId, subAdminId, name, email, mobile, permissions } = req.body;

    const findAdmin = await admin.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Admin not found",
      });
    }

    const subAdmin = await admin.findOne({ _id: subAdminId });
    if (!subAdmin) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Sub admin Not found",
      });
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (mobile) updateFields.mobile = mobile;
    if (permissions) updateFields.permissions = permissions;

    await admin.updateOne({ _id: subAdminId }, { $set: updateFields });

    return res.json({
      status: true,
      statusCode: 200,
      message: "Sub Admin Profile Update successfully",
    });
  } catch (err) {
    return res.json({
      status: true,
      statusCode: 400,
      message: err.message,
    });
  }
};

module.exports.getSubAdminPermissions = async (req, res) => {
  try {
    const { adminId, subAdminId } = req.body;

    const findAdmin = await admin.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Admin not found",
      });
    }

    const subAdmin = await admin.findOne({ _id: subAdminId });
    if (!subAdmin) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Sub admin Not found",
      });
    }

    const data = await admin.findOne({ _id: subAdminId }, { permissions: 1 });

    return res.json({
      status: true,
      statusCode: 200,
      message: "Sub Admin permissions show successfully",
      data: data,
    });
  } catch (err) {
    return res.json({
      status: true,
      statusCode: 400,
      message: err.message,
    });
  }
};

module.exports.addRole = async (req, res) => {
  try {
    const { adminId, subAdminId, role } = req.body;
    const findAdmin = await admin.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Admin Not Found",
      });
    }
    const findSubAdmin = await admin.findOne({ _id: subAdminId });
    if (!findSubAdmin) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "SubAdmin Not Found",
      });
    }
    await admin.updateOne({ _id: subAdminId }, { role: role });
    return res.json({
      status: true,
      statusCode: 200,
      message: "Role update successfully",
    });
  } catch (err) {
    return res.json({
      status: false,
      statusCode: 400,
      message: err.message,
    });
  }
};

module.exports.updateNotification = async (req, res) => {
  try {
    const { adminId, notificationId, message } = req.body;
    const findAdmin = await admin.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: true,
        statusCode: 400,
        messase: "Admin Not Found",
      });
    }

    const findNotification = await Notification.findOne({
      _id: notificationId,
    });
    if (!findNotification) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Notification not found",
      });
    }
    await Notification.updateOne(
      { _id: notificationId },
      { $set: { message: message } }
    );
    return res.json({
      status: true,
      statusCode: 200,
      message: "Notification Update Successfully",
    });
  } catch (err) {
    return res.json({
      status: false,
      statusCode: 400,
      message: err.message,
    });
  }
};

module.exports.deleteNotification = async (req, res) => {
  try {
    const { adminId, notificationId } = req.body;
    const findAdmin = await Admin.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: true,
        statusCode: 400,
        messase: "Admin Not Found",
      });
    }

    const findNotification = await Notification.findOne({
      _id: notificationId,
    });
    if (!findNotification) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Notification not found",
      });
    }
    await Notification.deleteOne({ _id: notificationId });
    return res.json({
      status: true,
      statusCode: 200,
      message: "Notification delete Successfully",
    });
  } catch (err) {
    return res.json({
      status: false,
      statusCode: 400,
      message: err.message,
    });
  }
};

module.exports.notificationList = async (req, res) => {
  try {
    const adminId = req.query.adminId;
    const findAdmin = await Admin.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: true,
        statusCode: 400,
        messase: "Admin Not Found",
      });
    }

    const list = await Notification.find(
      {},
      { _id: 0, __v: 0, updatedAt: 0, createdAt: 0 }
    );

    return res.json({
      status: true,
      statusCode: 200,
      message: "Notification show  Successfully",
      data: list,
    });
  } catch (err) {
    return res.json({
      status: false,
      statusCode: 400,
      message: err.message,
    });
  }
};

module.exports.addSystemInfo = async (req, res) => {
  try {
    const { adminId, name } = req.body;
    const findAdmin = await admin.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: true,
        statusCode: 400,
        messase: "Admin Not Found",
      });
    }

    let data = await system.create({ name: name });
    return res.json({
      status: true,
      statusCode: 200,
      message: "Notification show  Successfully",
      data: data,
    });
  } catch (err) {
    return res.json({
      status: false,
      statusCode: 400,
      message: err.message,
    });
  }
};

module.exports.systemInfoList = async (req, res) => {
  try {
    const { adminId } = req.body;
    const findAdmin = await admin.findOne({ _id: adminId });

    if (!findAdmin) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Admin Not Found",
      });
    }

    const list = await system.find({}, { name: 1, _id: 0 });
    return res.json({
      status: true,
      statusCode: 400,
      message: "System Info List Shown Successfully",
      data: list,
    });
  } catch (err) {
    return res.json({
      status: false,
      statusCode: 400,
      message: err.message,
    });
  }
};

module.exports.deleteSytemInfo = async (req, res) => {
  try {
    const { adminId, systemId } = req.body;

    const findAdmin = await admin.findOne({
      _id: adminId,
    });
    if (!findAdmin) {
      return res.json({
        status: true,
        statusCode: false,
        message: "Admin Not found",
      });
    }
    const findSystem = await system.findOne({ _id: systemId });

    if (!findSystem) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "System Info Not Find",
      });
    }

    const test = await system.deleteOne({ _id: systemId });
    return res.json({
      status: true,
      statusCode: 400,
      message: "System info delete successfully",
    });
  } catch (err) {
    return res.json({
      status: false,
      statusCode: 400,
      message: err.message,
    });
  }
};

module.exports.userAcceptReject = async (req, res) => {
  try {
    const { adminId, userId,isPending } = req.body;

    const findAdmin = await user.findOne({
      _id: adminId,
    });
    if (!findAdmin) {
      return res.json({
        status: true,
        statusCode: false,
        message: "Admin Not found",
      });
    }

    const findUser = await user.findOne({
      _id: userId,
    });
    if (!findUser) {
      return res.json({
        status: true,
        statusCode: false,
        message: "User Not found",
      });
    }
    const updateUser = await user.updateOne({ _id: userId },{$set:{isPending:isPending}});

    return res.json({
      status: true,
      statusCode: 200,
      message: "User Request Update Successfully",
      data:updateUser
    });
  } catch (err) {
    return res.json({
      status: false,
      statusCode: 400,
      message: err.message,
    });
  }
};

///////////////////////////////privacyPolicy//////////////
module.exports.addprivecyPolicy = async (req, res) => {
  try {
    const { adminId, policyMessage } = req.body;
    const findAdmin = await user.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Admin Not Found",
      });
    }

    const data = await privacyPolicy.create({ policyMessage });
    return res.json({
      status: true,
      statusCode: 200,
      message: "Privacy Policy Add successfully",
      data: data,
    });
  } catch (err) {
    return res.json({
      status: false,
      statusCode: 400,
      message: err.message,
    });
  }
};

module.exports.updatePrivecyPolicy = async (req, res) => {
  try {
    const { adminId, policyId, policyMessage } = req.body;

    const findAdmin = await user.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Admin Not Found",
      });
    }

    const data = await privacyPolicy.updateOne(
      { _id: policyId },
      { $set: { policyMessage } }
    );
    return res.json({
      status: true,
      statusCode: 200,
      message: "Privacy Policy Add successfully",
      data: data,
    });
  } catch (err) {
    return res.json({
      status: false,
      statusCode: 400,
      message: err.message,
    });
  }
};

module.exports.addtermCondition = async (req, res) => {
  try {
    const { adminId, termConditionMessage } = req.body;
    const findAdmin = await user.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Admin Not Found",
      });
    }

    const data = await termCondition.create({ termConditionMessage });
    return res.json({
      status: true,
      statusCode: 200,
      message: "TermConditionMessage Add successfully",
      data: data,
    });
  } catch (err) {
    return res.json({
      status: false,
      statusCode: 400,
      message: err.message,
    });
  }
};

module.exports.updateTermCondition = async (req, res) => {
  try {
    const { adminId, termConditionId, termConditionMessage } = req.body;

    const findAdmin = await user.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Admin Not Found",
      });
    }

    const data = await termCondition.updateOne(
      { _id: termConditionId },
      { $set: { termConditionMessage } }
    );
    return res.json({
      status: true,
      statusCode: 200,
      message: "Privacy Policy Add successfully",
      data: data,
    });
  } catch (err) {
    return res.json({
      status: false,
      statusCode: 400,
      message: err.message,
    });
  }
};

module.exports.addQusAns = async (req, res) => {
  try {
    const { adminId, qus, ans } = req.body;
    const findAdmin = await user.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Admin Not Found",
      });
    }

    const data = await qusans.create({
      qus,
      ans,
    });

    console.log(data, "data");
    return res.json({
      status: true,
      statusCode: 200,
      message: "TermConditionMessage Add successfully",
      data: data,
    });
  } catch (err) {
    return res.json({
      status: false,
      statusCode: 400,
      message: err.message,
    });
  }
};

module.exports.updateQusAns = async (req, res) => {
  try {
    const { adminId, qusAnsId, qus, ans } = req.body;
    const findAdmin = await user.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Admin Not Found",
      });
    }

    const findqusAns = await qusans.findOne({ _id: qusAnsId });
    if (!findqusAns) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Admin Not Found",
      });
    }

    const qusAnsObj = {};
    if (qus) qusAnsObj.qus;
    if (ans) qusAnsObj.ans;

    console.log(qusAnsObj, "qusAnsObj");
    const data = await qusans.updateOne({ id: adminId }, { $set: qusAnsObj });
    return res.json({
      status: true,
      statusCode: 200,
      message: "qusAns Update successfully",
      data: data,
    });
  } catch (err) {
    return res.json({
      status: false,
      statusCode: 400,
      message: err.message,
    });
  }
};

module.exports.deleteQusAns = async (req, res) => {
  try {
    const { adminId, qusAnsId } = req.body;
    const findAdmin = user.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Admin not found",
      });
    }
    const deleteQus = await qusans.deleteOne({ _id: qusAnsId });
    console.log(deleteQus, "deleteQus");
    return res.json({
      statusCode: 400,
      status: true,
      message: "qusAns Delete successfully",
    });
  } catch (err) {
    return res.json({
      status: false,
      statusCode: 400,
      message: err.message,
    });
  }
};

module.exports.deshboardCount = async (req, res) => {
  try {
    const adminId = req.query.adminId;
    const findAdmin = await user.findOne({ _id: adminId });

    if (!findAdmin) {
      return res.json({
        statusCode: 400,
        status: false,
        message: "Admin Not Found",
      });
    }

    // Count the active users, excluding admins
    let userRequest = await user.countDocuments({ isPending: "Pending" });
    let totalUser = await user.countDocuments({ role: { $ne: "ADMIN" } }); // Exclude admins
    let blockUser = await user.countDocuments({
      isBlock: "yes",
      role: { $ne: "ADMIN" },
    }); // Exclude admins
    let activeUser = await user.countDocuments({
      status: "active",
      role: { $ne: "ADMIN" },
    }); // Exclude admins
    let deActiveUser = await user.countDocuments({
      status: "inactive",
      role: { $ne: "ADMIN" },
    }); // Exclude admins
    let approvedUser = await user.countDocuments({
      isPending: "Approved",
      role: { $ne: "ADMIN" },
    }); // Exclude admins

    return res.json({
      status: true,
      statusCode: 200,
      message: "Dashboard Count Show Successfully",
      userRequest,
      totalUser,
      blockUser,
      activeUser,
      deActiveUser,
      approvedUser,
    });
  } catch (error) {
    return res.json({
      statusCode: 400,
      status: false,
      message: error.message,
    });
  }
};

module.exports.totalActiveUser = async (req, res) => {
  try {
    const adminId = req.query.adminId;
    const findAdmin = await user.findOne({ _id: adminId });
    console.log(findAdmin,"gggggggggg",adminId)
    if (!findAdmin) {
      return res.json({
        statusCode: 400,
        status: false,
        message: "Admin Not Found",
      });
    }

    // Count the active users
    let activeUserCount = await user.find({ status: "active"},{name:1,email:1});
    return res.json({
      status: true,
      statusCode: 200,
      message: "Active User Count Retrieved Successfully",
      totalActiveUsers: activeUserCount,
    });
  } catch (error) {
    return res.json({
      statusCode: 400,
      status: false,
      message: error.message,
    });
  }
};

module.exports.totalDeactiveUser = async (req, res) => {
  try {
    const adminId = req.query.adminId;
    const findAdmin = await user.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Admin Not Found",
      });
    }
    let deActiveUser = await user.find({ status: "inactive" }, { name: 1 });
    return res.json({
      status: true,
      statusCode: 200,
      message: "All Deactive User Shown Successfully",
      data: deActiveUser,
    });
  } catch (error) {
    return res.json({
      statusCode: 400,
      status: true,
      message: error.message,
    });
  }
};

module.exports.totalPendingReq = async (req, res) => {
  try {
    const adminId = req.query.adminId;
    const findAdmin = await user.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: false,
        statuscode: 400,
        message: "Admin Not Found",
      });
    }
    let deActiveUser = await user.find({ isPending: "Pending" }, {});

    return res.json({
      status: true,
      statusCode: 200,
      message: "All Pending Request Show Successfully",
      data: deActiveUser,
    });
  } catch (error) {
    return res.json({
      statusCode: 400,
      status: true,
      message: error.message,
    });
  }
};

module.exports.totalApprovedReq = async (req, res) => {
  try {
    const { adminId } = req.body;
    const findAdmin = await user.findOne({ _id: adminId });
    console.log(findAdmin, "findAdmin");
    let deActiveUser = await user.find({ isPending: "Approved" });

    return res.json({
      status: true,
      statusCode: 200,
      message: "All Pending Req Show Successfully",
      data: deActiveUser,
    });
  } catch (error) {
    return res.json({
      statusCode: 400,
      status: true,
      message: error.message,
    });
  }
};

module.exports.blockUserList = async (req, res) => {
  try {
    const adminId = req.query.adminId;
    const findAdmin = await user.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: true,
        statusCode: 400,
        message: "Admin not found",
      });
    }
    let blockUser = await user.find(
      { isBlock: "Yes" },
      { name: 1, username: 1, email: 1, mobile: 1 }
    );

    return res.json({
      status: true,
      statusCode: 200,
      message: "All Block User List Show Successfully",
      data: blockUser,
    });
  } catch (error) {
    return res.json({
      statusCode: 400,
      status: true,
      message: error.message,
    });
  }
};

/////////////////////////////group////////////////////////////////////

module.exports.createGroup = async (req, res) => {
  try {
    const { adminId, groupName, memberIds } = req.body;
    const findAdmin = await user.findOne({ _id: adminId });
    const groupImage = req.file;

    if (!findAdmin) {
      return res.json({
        status: true,
        statusCode: 400,
        message: "Admin not found",
      });
    }

    // Ensure adminId is included in memberIds
    const membersArray = Array.isArray(memberIds) ? memberIds : [];
    if (!membersArray.includes(adminId)) {
      membersArray.push(adminId);
    }

    // Use the location of the uploaded file (the URL)
    const groupImageUrl = groupImage ? groupImage.location : null;

    const newGroup = new group({
      groupName,
      groupImage: groupImageUrl, // Store the URL here
      adminId,
      members: membersArray,
    });

    let data = await newGroup.save();

    return res.json({
      status: true,
      statusCode: 200,
      message: "New Group Created Successfully",
      data: data,
    });
  } catch (error) {
    return res.json({
      statusCode: 400,
      status: true,
      message: error.message,
    });
  }
};


module.exports.addMembers = async (req, res) => {
  try {
    const { adminId, userId, groupId } = req.body;
    const findAdmin = await user.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Admin not found",
      });
    }

    const findGroup = await group.findOne({ _id: groupId });
    if (!findGroup) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Group Not Fount",
      });
    }

    findGroup.members.push(userId);
    const addMembersInGroup = await findGroup.save();
    return res.json({
      status: true,
      statusCode: 200,
      message: "New  Group Member Add Successfully",
      data: addMembersInGroup,
    });
  } catch (error) {
    return res.json({
      statusCode: 400,
      status: true,
      message: error.message,
    });
  }
};

module.exports.getGroupInfo = async (req, res) => {
  try {
    const { groupId } = req.query;
    const findGroup = await group.findOne({ _id: groupId });
    if (!findGroup) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Group Not Found",
      });
    }

    // Find members by their IDs
    const members = await user.find({
      _id: { $in: findGroup.members },
    });

    const membersDetails = members.map((member) => ({
      id: member._id,
      name: member.name,
      email: member.email,
      mobile: member.mobile,
    }));

    return res.json({
      status: true,
      statusCode: 200,
      message: "Group Information Retrieved Successfully",
      data: {
        groupId: findGroup._id,
        groupName: findGroup.groupName,
        members: membersDetails,
      },
    });
  } catch (error) {
    return res.json({
      statusCode: 400,
      status: true,
      message: error.message,
    });
  }
};

module.exports.deleteGroup = async (req, res) => {
  try {
    const { adminId,groupId } = req.body;
    const findAdmin = await user.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Group Not Found",
      });
    }
    const findGroup = await group.findOne({ _id: groupId });
    if (!findGroup) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Group Not Found",
      });
    }

    let deleteInfo = await group.deleteOne({ _id: groupId });
    return res.json({
      status: true,
      statusCode: 200,
      message: "Group Delete Successfully",
      data: deleteInfo,
    });
  } catch (error) {
    return res.json({
      statusCode: 400,
      status: true,
      message: error.message,
    });
  }
};

module.exports.deleteUserGroup = async (req, res) => {
  try {
    const { adminId, membserIds } = req.body;

    // Find the group by adminId
    const foundGroup = await group.findOne({ adminId: adminId });
    if (!foundGroup) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Group Not Found",
      });
    }

    // Check if the member IDs are present in the group's members
    const invalidIds = membserIds.filter(id => !foundGroup.members.includes(id));
    if (invalidIds.length > 0) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Some IDs Not In The Group",
      });
    }

    // Remove specified members from the group
    foundGroup.members = foundGroup.members.filter(member => !membserIds.includes(member));
    await foundGroup.save();

    return res.json({
      status: true,
      statusCode: 200,
      message: "Members Deleted Successfully",
      data: foundGroup,
    });
  } catch (error) {
    return res.json({
      statusCode: 500,
      status: false,
      message: error.message,
    });
  }
};
