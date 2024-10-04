const nodemailer = require('nodemailer');

// Create a transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Ensure this is correct; it should be 'gmail'
  auth: {
    user: 'githubaayush95@gmail.com', // Your email address
    pass: 'edzk hpju qrgf sudr' // Your app-specific password or regular password
  }
});

module.exports.sendOtp = async (email, otp, name) => {
  try {
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Ip calling" <githubaayush95@gmail.com>', // Sender address
      to: email, // Receiver address (dynamic email parameter)
      subject: 'Your OTP Code', // Subject line
      text: `Hello ${name}, your OTP code is ${otp}.`, // Plain text body with dynamic OTP and name
      html: `<p>Hello ${name},</p><p>Your OTP code is <strong>${otp}</strong>.</p>`, // HTML body with dynamic OTP and name
    });

    return { status: 'success', messageId: info.messageId };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
};
