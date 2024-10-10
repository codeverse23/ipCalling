const { sendOtp } = require("../helper/email");
const { jwtToken } = require("../helper/jwt");
const user = require("../model/user");

module.exports.signUp = async (req, res) => {
  try {
    const { name, username, email, mobile, password } = req.body;
  
    var otp = Math.floor(1000 + Math.random() * 9000);
    // Find user by email
    const findUser = await user.findOne({ email: email  });
    if (findUser) {
      return res.json({
        statusCode: 400,
        status: false,
        message: "This Email Is Already Exist",
      });
    }
    const userObj = { name, username, email, mobile, password, otp };
    let data = await user.create(userObj);
    sendOtp(email, otp, name);
    return res.json({
      statusCode: 200,
      status: true,
      message: "User Create Successfully",
      data: data,
    });
  } catch (err) {
    return res.json({
      statusCode: 400,
      status: false,
      message: err.message,
    });
  }
};

module.exports.checkUsername = async (req, res) => {
  try {
    const { username } = req.body;

    if (username.length < 4) {
      return res.json({
        statusCode: 400,
        status: false,
        message: "Username must be at least 4 characters long",
      });
    }

    // Check if username is already taken
    const findUser = await user.findOne({ username: username });
    if (findUser) {
      return res.json({
        statusCode: 400,
        status: false,
        message: "Username is already taken Please try another username",
      });
    }

    return res.json({
      statusCode: 200,
      status: true,
      message: "Username is available",
    });

  } catch (err) {
    return res.json({
      statusCode: 500,
      status: false,
      message: err.message,
    });
  }
};

module.exports.varifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const findUser = await user.findOne({ email: email });
    if (!findUser) {
      return res.json({
        status: true,
        message: "User Not Found",
        data: "",
      });
    }
    if (findUser.otp !== otp) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "please provide currect otp",
      });
    }
    await user.findOneAndUpdate(
      { _id: findUser._id },
      { $set: { isVerified: true } }
    );
    return res.json({
      status: true,
      statusCode: 200,
      message: "User Varify Successfully",
    });
  } catch (err) {
    return res.json({
      status: true,
      message: "Internal Server Error",
      data: err.message,
    });
  }
};

module.exports.login = async (req, res) => {
  try {
    let { email, password,username } = req.body;

    const findUser = await user.findOne({
      $or: [
        { email: email },
        { username: username }
      ]
    });
    
    console.log(findUser,"findUser")
    if (!findUser) {
      return res.json({
        statusCode: 400,
        status: false,
        message: "User Not Found",
      });
    }

    if (findUser.isVerified === false) {
      return res.json({
        statusCode: 400,
        status: false,
        message: "Please Verify Account",
      });
    }
    // Compare the provided password with the hashed password in the database
    const isMatch = password === findUser.password;
    if (!isMatch) {
      return res.json({
        statusCode: 400,
        status: false,
        message: "Please Enter the correct password",
      });
    }

    // Generate JWT token
    const role =findUser.role
    const token = jwtToken(email, password, role); // Replace this with your actual token generation logic

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

module.exports.changPassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    const findUser = await user.findOne({ email: email });

    if (!findUser) {
      return res.json({
        statusCode: 400,
        status: false,
        message: "User does not exist",
      });
    }

    if (findUser.password !== oldPassword) {
      return res.json({
        statusCode: 400,
        status: false,
        message: "Invalid old password",
      });
    }

    const result = await user.updateOne(
      { email: email },
      { $set: { password: newPassword } }
    );

    if (result.modifiedCount === 0) {
      return res.json({
        statusCode: 400,
        status: false,
        message: "Failed to update password",
      });
    }

    return res.json({
      statusCode: 200,
      status: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    return res.json({
      statusCode: 400,
      status: false,
      message: err.message,
    });
  }
};

module.exports.forgotPasswordSendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    var otp = Math.floor(1000 + Math.random() * 9000);
    const findUser = await user.findOne({ email: email });

    if (!findUser) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "User Not Found",
        data: "",
      });
    }
    const name = findUser.name;
    sendOtp(email, otp, name);
    await user.findOneAndUpdate({ _id: findUser._id }, { $set: { otp: otp } });
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

module.exports.forgotChangePassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const findUser = await user.findOne({ email: email });
    if (!findUser) {
      return res.json({
        status: true,
        message: "User Not Found",
        data: "",
      });
    }
    if (findUser.otp !== otp) {
      return res.json({
        status: false,
        statusCode: 400,
        message: "please provide currect otp",
      });
    }
    await user.findOneAndUpdate(
      { _id: findUser._id },
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
