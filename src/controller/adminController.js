const { sendOtp } = require("../helper/email");
const { jwtToken } = require("../helper/jwt");
const admin = require("../model/admin");
const notification = require("../model/notification");
const system = require("../model/system");
const bcrypt = require('bcryptjs');

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find admin by email
    const findAdmin = await admin.findOne({ email: email });
    if (!findAdmin) {
      return res.json({
        statusCode: 400,
        status: false,
        message: "Admin Not Found"
      });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await password ===findAdmin.password
    if (!isMatch) {
      return res.json({
        statusCode: 400,
        status: false,
        message: "Please Enter the correct password"
      });
    }

    // Generate JWT token
    const token = jwtToken(email, password); // Replace this with your actual token generation logic

    return res.json({
      status: 200,
      statusCode: true,
      message: "Login Successfully",
      data: token
    });

  } catch (err) {
    res.json({
      statusCode: 400,
      status: false,
      message: err.message
    });
  }
};

module.exports.adminProfile = async (req, res) => {
  try {
    const adminId = req.query.adminId;
    const findAdmin = await admin.findOne({ _id: adminId });
    res.json({
      statusCode: 200,
      status: true,
      message: "Admin Profile Shown Successfully",
      data: findAdmin
    })
  } catch (err) {
    res.json({
      statusCode: 400,
      status: false,
      message: "Internal Server Error",
      data: findAdmin
    })
  }
};

module.exports.changPassword = async (req, res) => {
  try {
    const { adminId, password, newPassword } = req.body;
    const findAdmin = await admin.findOne({ _id: adminId });
    if (!findAdmin) {
      res.json({
        status: 400,
        message: "Admin Not Found",
        data: ""
      })
    }
    if (findAdmin.password === password) {
      const updatePassword = await admin.findOneAndUpdate({ _id: adminId }, { $set: { password: newPassword } });
      res.send({
        status: 200,
        message: "New Password Update Successfully",
        data: ""
      })
    } else {
      res.json({
        status: 400,
        message: "please enter currect password",
        data: ""
      })
    }
  } catch (err) {
    res.json({
      status: 400,
      message: "Internal Server Error",
      data: err.message
    })
  }
};

module.exports.updateAdminProfile = async (req, res) => {
  try {
    const { adminId, name, email, mobile } = req.file;
    console.log(req.file,"gggg")
    console.log("this is test file test test test test test ")
    const findAdmin = await admin.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: false,
        statusCode: 400,
        messase: "Admin Not Found"
      })
    };
    let updateObject = {};
    if (name) updateObject.name = name;
    if (email) updateObject.email = email;
    if (mobile) updateObject.mobile = mobile;

    await admin.updateOne({ _id: adminId }, { $set: updateObject })
    return res.json({
      status: true,
      statusCode: 200,
      message: "Admin profile Update successfully"
    })

  } catch (err) {
    res.json({
      status: true,
      statusCode: 400,
      message: err.message
    })
  }
};

module.exports.forgotPasswordSendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    var otp = Math.floor(1000 + Math.random() * 9000);
    const findAdmin = await admin.findOne({ email: email });
    if (!findAdmin) {
      res.json({
        status: 400,
        message: "Admin Not Found",
        data: ""
      })
    };
    const name = findAdmin.name;
    sendOtp(email, otp, name)
    await admin.findOneAndUpdate({ _id: findAdmin._id }, { $set: { otp: otp } })
    return res.json({
      status: true,
      statusCode: 200,
      message: "mail send successfully"
    })
  } catch (err) {
    res.json({
      status: 400,
      message: "Internal Server Error",
      data: err.message
    })
  }
};

module.exports.varifyOtp = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const findAdmin = await admin.findOne({ email: email });
    if (!findAdmin) {
      res.json({
        status: 400,
        message: "Admin Not Found",
        data: ""
      })
    };
    if (!findAdmin.otp === otp) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "please provide currect otp"
      })
    }
    await admin.findOneAndUpdate({ _id: findAdmin._id }, { $set: { password: password } })
    return res.json({
      status: true,
      statusCode: 200,
      message: "Password Change Successfully "
    })
  } catch (err) {
    res.json({
      status: 400,
      message: "Internal Server Error",
      data: err.message
    })
  }
};

module.exports.addSubAdmin = async (req, res) => {
  try {
    const { adminId, name, email, mobile, password } = req.body;
    const findAdmin = await admin.findOne({ _id: adminId });
    if (!findAdmin) {
      res.json({
        status: 400,
        message: "Admin Not Found",
        data: ""
      })
    };
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("this is test file")
    await admin.insertMany({
      name: name,
      email: email,
      mobile: mobile,
      password: hashedPassword,
      role: "SubAdmin"
    })
    return res.json({
      status: true,
      statusCode: 200,
      message: "Sub Admin Add Successfully"
    })
  } catch (err) {
    res.json({
      status: 400,
      message: "Internal Server Error",
      data: err.message
    })
  }
};

module.exports.subAdminList = async (req, res) => {
  try {
    const adminId = req.query.adminId;
    const findAdmin = await admin.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: 400,
        message: "Admin Not Found",
        data: ""
      })
    };
    const list = await admin.find({ role: "SubAdmin" }, { password: 0, __v: 0, role: 0, isBlock: 0 });
    return res.json({
      status: true,
      statusCode: 200,
      message: "Sub Admin List Shown Successfully",
      data: list
    });

  } catch (err) {
    res.json({
      status: 400,
      message: "Internal Server Error",
      data: err.message
    })
  }
};

module.exports.blockSubAdmin = async (req, res) => {
  try {
    const { adminId, subAdminId, isBlock } = req.body
    const findAdmin = await admin.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Admin Not Found"
      });
    };

    const findSubAdmin = await admin.findOne({ _id: subAdminId });
    if (!findSubAdmin) {
      return res.json({
        status: 400,
        statusCode: false,
        message: "SubAdmin Not Found"
      })
    };

    await admin.updateOne({ _id: subAdminId }, { isBlock: isBlock });
    return res.json({
      status: true,
      statusCode: 200,
      message: "SubAdmin Block Successfully"
    });

  } catch (err) {
    res.json({
      status: 400,
      statusCode: false,
      message: err.message
    })
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
        message: "Admin Not found"
      });
    }
    const findSubAdmin = await admin.findOne({ _id: subAdminId });
    if (!findSubAdmin) {
      res.json({
        status: false,
        statusCode: 400,
        message: "Sub Admin Not found"
      })
    }

    await admin.updateOne({ _id: subAdminId }, { isBlock: isBlock });
    return res.json({
      status: false,
      statusCode: 400,
      message: "sub admin unBlock successfully"
    })

  } catch (err) {
    res.json({
      status: false,
      statusCode: 400,
      message: err.message
    })
  }
};

module.exports.deleteSubAdmin = async (req, res) => {
  try {
    const { adminId, subAdminId } = req.body;
    const findAdmin = await admin.findOne({ _id: adminId });
    if (!findAdmin) {
      res.json({
        status: true,
        statusCode: 400,
        message: "Admin Not Found"
      })
    };
    await admin.deleteOne({ _id: subAdminId })
    res.json({
      status: true,
      statuscode: 200,
      message: "subAdmin delete successfully"
    })
  } catch (err) {
    return res.json({
      status: false,
      statusCode: 400,
      message: err.message
    })
  }
};

module.exports.updateSubProfile = async (req, res) => {
  try {
    const { adminId, subAdminId, name, email, mobile, password } = req.body;
    const findAdmin = await admin.findOne({ _id: adminId });
    if (!findAdmin) {
      res.json({
        status: true,
        statusCode: 400,
        message: "Admin Not Found"
      })
    };
    await admin.deleteOne({ _id: subAdminId })
    res.json({
      status: true,
      statuscode: 200,
      message: "subAdmin delete successfully"
    });
  } catch (err) {
    return res.json({
      status: false,
      statusCode: 400,
      message: err.message
    })
  }
};

module.exports.addPermissions = async (req, res) => {
  try {
    const { adminId, subAdminId, permissions } = req.body;
    const findAdmin = await admin.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Admin not found"
      })
    };

    const subAdmin = await admin.findOne({ _id: subAdminId });

    if (!subAdmin) {
      res.send({
        status: false,
        statusCode: 400,
        message: "Sub admin Not found"
      })
    }

    await admin.updateOne({ _id: subAdminId }, { $set: { permissions: permissions } });
    res.json({
      status: true,
      statusCode: 200,
      message: "Sub admin Permition Add successfully"
    })

  } catch (err) {
    res.send({
      status: true,
      statusCode: 400,
      message: err.message
    })
  }
};

module.exports.removePermissions = async (req, res) => {
  try {
    const { adminId, subAdminId, permissions } = req.body;

    const findAdmin = await admin.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Admin not found"
      })
    };

    const subAdmin = await admin.findOne({ _id: subAdminId });

    if (!subAdmin) {
      res.send({
        status: false,
        statusCode: 400,
        message: "Sub admin Not found"
      })
    }

    await admin.updateOne({ _id: subAdminId }, { $set: { permissions: permissions } });
    res.json({
      status: true,
      statusCode: 200,
      message: "Sub admin Permition Remove successfully"
    })

  } catch (err) {
    res.send({
      status: true,
      statusCode: 400,
      message: err.message
    })
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
        message: "Admin not found"
      })
    };

    const subAdmin = await admin.findOne({ _id: subAdminId });
    if (!subAdmin) {
      res.send({
        status: false,
        statusCode: 400,
        message: "Sub admin Not found"
      })
    }

    await admin.updateOne({ _id: subAdminId }, { $set: { password: password } });
    res.json({
      status: true,
      statusCode: 200,
      message: "Sub admin Password Change successfully"
    })

  } catch (err) {
    res.send({
      status: true,
      statusCode: 400,
      message: err.message
    })
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
        message: "Admin not found"
      })
    };

    const subAdmin = await admin.findOne({ _id: subAdminId });
    if (!subAdmin) {
      res.send({
        status: false,
        statusCode: 400,
        message: "Sub admin Not found"
      })
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (mobile) updateFields.mobile = mobile;
    if (permissions) updateFields.permissions = permissions;

    await admin.updateOne({ _id: subAdminId }, { $set: updateFields });

    res.json({
      status: true,
      statusCode: 200,
      message: "Sub Admin Profile Update successfully"
    })

  } catch (err) {
    res.send({
      status: true,
      statusCode: 400,
      message: err.message
    })
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
        message: "Admin not found"
      })
    };

    const subAdmin = await admin.findOne({ _id: subAdminId });
    if (!subAdmin) {
      res.send({
        status: false,
        statusCode: 400,
        message: "Sub admin Not found"
      })
    }

    const data = await admin.findOne({ _id: subAdminId }, { permissions: 1 });

    res.json({
      status: true,
      statusCode: 200,
      message: "Sub Admin permissions show successfully",
      data: data
    })

  } catch (err) {
    res.send({
      status: true,
      statusCode: 400,
      message: err.message
    })
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
        message: "Admin Not Found"
      })
    };
    const findSubAdmin = await admin.findOne({ _id: subAdminId });
    if (!findSubAdmin) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "SubAdmin Not Found"
      })
    }
    await admin.updateOne({ _id: subAdminId }, { role: role });
    res.json({
      status: true,
      statusCode: 200,
      message: "Role update successfully"
    })
  } catch (err) {
    res.json({
      status: false,
      statusCode: 400,
      message: err.message
    })
  }
};

module.exports.addNotification = async (req, res) => {
  try {
    const { adminId, message } = req.body;
    const findAdmin = await admin.findOne({ _id: adminId });
    if (!findAdmin) {
      return res.json({
        status: true,
        statusCode: 400,
        message: "Admin Not Found"
      })
    };

    await notification.insertMany({ message: message })
    res.json({
      status: true,
      statusCode: 200,
      message: "Notification Add Successfully"
    })

  } catch (err) {
    return res.json({
      status: false,
      statusCode: 400,
      message: err.message
    })
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
        messase: "Admin Not Found"
      })
    };

    const findNotification = await Notification.findOne({ _id: notificationId })
    if (!findNotification) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Notification not found"
      })
    };
    await Notification.updateOne({ _id: notificationId }, { $set: { message: message } });
    res.json({
      status: true,
      statusCode: 200,
      message: "Notification Update Successfully"
    })
  } catch (err) {
    res.json({
      status: false,
      statusCode: 400,
      message: err.message
    })
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
        messase: "Admin Not Found"
      })
    };

    const findNotification = await Notification.findOne({ _id: notificationId })
    if (!findNotification) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "Notification not found"
      })
    };
    await Notification.deleteOne({ _id: notificationId });
    res.json({
      status: true,
      statusCode: 200,
      message: "Notification delete Successfully"
    })
  } catch (err) {
    res.json({
      status: false,
      statusCode: 400,
      message: err.message
    })
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
        messase: "Admin Not Found"
      })
    };

    const list = await Notification.find({}, { _id: 0, __v: 0, updatedAt: 0, createdAt: 0 });

    res.json({
      status: true,
      statusCode: 200,
      message: "Notification show  Successfully",
      data: list
    })
  } catch (err) {
    res.json({
      status: false,
      statusCode: 400,
      message: err.message
    })
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
        messase: "Admin Not Found"
      })
    };


    let data = await system.create({ name: name })
    res.json({
      status: true,
      statusCode: 200,
      message: "Notification show  Successfully",
      data: data
    })
  } catch (err) {
    res.json({
      status: false,
      statusCode: 400,
      message: err.message
    })
  }
};

module.exports.systemInfoList = async (req, res) => {
  try {
    const { adminId } = req.body;
    const findAdmin = await admin.findOne({ _id: adminId });

    if (!findAdmin) {
      res.json({
        status: false,
        statusCode: 400,
        message: "Admin Not Found"
      })
    };

    const list = await system.find({}, { name: 1, _id: 0 });
    res.json({
      status: true,
      statusCode: 400,
      message: "System Info List Shown Successfully",
      data: list
    })
  } catch (err) {
    res.send({
      status: false,
      statusCode: 400,
      message: err.message
    })
  }
};

module.exports.deleteSytemInfo = async (req, res) => {
  try {
    const { adminId, systemId } = req.body;

    const findAdmin = await admin.findOne({
      _id: adminId
    });
    if (!findAdmin) {
      return res.json({
        status: 400,
        statusCode: false,
        message: "Admin Not found"
      })
    }
    const findSystem = await system.findOne({ _id: systemId });

    if (!findSystem) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "System Info Not Find"
      })
    };

    const test = await system.deleteOne({ _id: systemId });
    res.json({
      status: true,
      statusCode: 400,
      message: "System info delete successfully"
    })

  } catch (err) {
    res.json({
      status: false,
      statusCode: 400,
      message: err.message
    })
  }
};
