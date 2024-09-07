const otpGenerator = require('otp-generator');
const bcrypt = require("bcrypt");
const Otps = require("../Model/otpModel");
const transporter = require("./mailTransporter");
const ejs = require("ejs");

const sendOtpVerificationEmail = async (result, res) => {
    try{
    const otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    const html = await ejs.renderFile('../Server/views/welcome.ejs', {username: result.name, otp: otp}, { async: true }) 
    //mailOptions
      const mailOptions = {
        from: process.env.AUTH_USER,
        to: result.email,
        subject: "Verify Your Eko-Diary Email Address",
        html
      }

      //Hash the otp
      const saltRounds = 10;
      const hashedOtp = await bcrypt.hash(otp, saltRounds);

      const newOtp = await new Otps({
        userId: result._id,
        otp: hashedOtp,
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000
      })
      await newOtp.save();
   
     await transporter.sendMail(mailOptions);

      res.json({
        status: "PENDING",
        message: "OTP has been sent to your email.",
        data: result
      })
 
    } catch(err){
        console.log(err.message);
        res.json({
            status: "FAILED",
            message: "Failed to send Otp"
        });
}
}
module.exports = sendOtpVerificationEmail;