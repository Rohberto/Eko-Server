 const User = require("../Model/userModel");
 const bcrypt = require("bcrypt");
 const otpGenerator = require('otp-generator');
const sendOtpVerificationEmail = require("../Util/sendOtpMail");
const Otps = require("../Model/otpModel");
const jwt = require("jsonwebtoken");
const transporter = require("../Util/mailTransporter");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();
const googleUser =   require("../Model/googleUserModel");

//login 
const Login = async (req, res) => {
  try{
    const {email, password} = req.body;
    //check if fields are not empty
    if (!email || !password){
      throw Error("Empty Input details are not allowed");
    }else {
    //check if user exists
    const userPresent = await User.find({email});
    if (!userPresent.length){
      throw Error("User does not exist");
    }else{
      //check if password is correct
      const isCorrect = await bcrypt.compare(password, userPresent[0].password);
      if(!isCorrect){
        throw Error("Password is incorrect");
      }else {
        res.json({
          status: "SUCCESS",
          message: "Login Successful",
          data: userPresent[0]
        })
      }
    }
    }
  }catch(err){
    res.json({
      status: "FAILED",
      message: err.message
    })
  }

};
//signup
 const signUp = (req, res) => {
  let {name, email, password} = req.body;
  if (name == "" || email == "" || password == ""){
    res.json({
        status: "FAILED",
        message: "Empty Input Fields"
    })
  } else if (!/^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)){
    res.json({
        status: "FAILED",
        message: "Invalid Email Address"
    })
  } else if (password.length < 8){
    res.json({
        status: "FAILED",
        message: "password is too short."
    })
  }else{
//checking if user already exists
User.find({email}).then((result) => {
  if(result.length){
    //this means user already exists
    res.json({
      status: "FAILED",
      message: "User with email already exists"
    })
  } 
  
  else{
    //now let's create User
    //password handling

    const saltRounds = 10;
    bcrypt.hash(password, saltRounds)
    .then((hashedPwd) => {
      //create new user here
      const newUser = new User({
        name,
        email,
        password: hashedPwd,
        verified: false,
        role: 'User'
      })
      newUser.save()
      .then((result) => {
        //SEND OTP
      sendOtpVerificationEmail(result, res);
      })
      .catch((err) => {
        console.log(err.message);
        res.json({
          status: "FAILED",
          message: "failed to create new user"
        })
      })
    })
    .catch((err) => {
      console.log(err.message);
      res.json({
        status: "FAILED",
        message: "Failed to hash password."
      })
    })
  }
})
.catch((err) => {
  console.log(err.message);
  res.json({
    status: "FAILED",
    message: "Error while searching for existing email."
  })
})
  }
};

//verify otp
const verifyOtp = async (req, res) => {
  try{
    let {userId, otp} = req.body;
if(!userId || !otp){
  throw Error ("Empty otp details are not allowed");
} else {
  const userOtpRecords = await Otps.find({
    userId
  });

  if (userOtpRecords.length <= 0) {
    throw new Error("Account doesn't exist or has been verified already. Please sign up or login.")
  } else{
    //user otp record exists
    const {expiresAt} = userOtpRecords[0];
    const hashedOtp = userOtpRecords[0].otp;

    if (expiresAt < Date.now()){
      //user otp records has expired
      await Otps.deleteMany({ userId});
      throw new Error("otp has expired")
    } else{
      const validOTP = await bcrypt.compare(otp, hashedOtp);
      if(!validOTP){
        //supplied Otp is wrong
        throw new Error("Invalid code, check your inbox");
      } else{
        //success
        const result = await User.updateOne({_id: userId}, {verified: true});
        const verifiedUser = await User.findById(userId);
        Otps.deleteMany({userId});
        res.json({
          status: "VERIFIED",
          message: "User email verified successfully",
          data: verifiedUser
        })
      }
    }
  }
}
  } catch(err) {
    res.json({
      status: "FAILED",
      message: err.message
    })
  }

}

//Resend Otp
const resendOTP = async (req, res) => {
try{
  let {userId, email, name} = req.body;
  const isOtp = await Otps.find({userId});
  if(!userId || !email){
    throw Error("Empty details are not allowed");
  } else if(isOtp.length){
    //delete existing records
    await Otps.deleteMany({userId});
    let result = {_id: userId, email, name}
    sendOtpVerificationEmail(result, res);
 }else{
  res.json(
    {
      status: "FAILED",
      message: "User has been verified"
    }
  )
 }
} catch(err) {
  res.json({
    status: "FAILED",
    message: err.message
  })
}
}
//FORGOT PASSWORD
 const forgotPassword = async (req, res) => {
  try{
  const {email} = req.body;
//check if email exists
 const user = await User.find({email});

 if(!user.length) {
  throw Error("User does not exist.")
 } else{
  //send recovery link
  
const token =jwt.sign({_id: user[0]._id}, process.env.RESET, {expiresIn: "2h"});
//mailOptions
 const mailOptions = {
  from: process.env.AUTH_USER,
  to: email,
  subject: "Reset Eko-Diary Password",
  html: `<p>click <a href="https://eko-diary-nine.vercel.app/reset-password/${user[0].id}/${token}">Here</a> to reset your password.</p>
  <p>This verification link expires in 2 hours.</p>`
}
await transporter.sendMail(mailOptions);
res.send({
  status: 'SUCCESS',
  message: "Verification link has been sent"
})
 }
 }
catch(err){
res.json({
  status: "FAILED",
  message: err.message
})
}

 }
 //RESET PASSWORD
const resetPassword = (req, res) => {
const {id, token} = req.params;
const {password} = req.body;

jwt.verify(token, process.env.RESET, (err, decoded) => {
  if (err){
    res.json(
      {status: "FAILED",
        message: "error with token"
      }
    )
  } else {
    bcrypt.hash(password, 10).then(hash => {
      User.findByIdAndUpdate({_id: id}, {password: hash})
      .then(success => {
        res.send({
          status: "SUCCESS",
          message: "Password has been changed"
        })
      }).catch(err => {
        console.log(err);
        res.json({
          status: "FAILED",
          message: err.message
        })
      })
    }).catch(err => {
      console.log(err);
      res.json({
        status: "FAILED",
        message: err.message
      })
    })
  }
})
}

//GOOGLE AUTH
const googleAuth = async (req, res) => {
  const { credential, client_id } = req.body;
  try {
  const ticket = await client.verifyIdToken({
  idToken: credential,
  audience: client_id,
  });
  const payload = ticket.getPayload();
  const email = payload.email;
  const userPresent = await User.find({email});
  const googleUserPresent = await googleUser.find({email});
  if(userPresent.length){
  return  res.json({
    status: "FAILED",
   message: "User already exist"
   })
  }else if(googleUserPresent.length){
    res.status(200).json({
      status: "SUCCESS",
      message: "Google User Found",
      data: googleUserPresent[0]
    });
  }else{
    const newGoogleUser = new googleUser({
      name: `${payload.given_name} ${payload.family_name}`,
      userid: payload.sub,
      email: payload.email,
      role: "User"
    })
    await newGoogleUser.save();
    res.status(200).json({
      status: "SUCCESS",
      message: "Google User has been created.",
      data: newGoogleUser
    });
  }
  } catch (err) {
    console.log(err);
  res.json({
    status: "FAILED",
    message: err.message
  });
  }
}
module.exports = {Login,signUp, verifyOtp, resendOTP, forgotPassword, resetPassword, googleAuth};