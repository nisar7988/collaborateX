const bcrypt = require('bcryptjs');
const nodemailer = require ('nodemailer');
const User = require ('../models/user.model');
const path = require ('path');
require ('dotenv').config ({path:path.join("D:/nisar/final - project/backend/", '.env')});
const otpStore = {};
console.log(path.join ("D:/nisar/final - project/backend/", '.env'))
console.log(process.env.EMAIL_USER)
const generateOtp = () => {
  return Math.floor (1000 + Math.random () * 9000);
};
const transporter = nodemailer.createTransport ({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const handleSignup = async (req, res) => {
  console.log ('Signup request received');
  const {email,password} = req.body;
  try {
    const user = await User.findOne ({email});
    if (user) {
      return res.status (400).json ({message: 'User already exists'});
    }
    const otp = generateOtp ();
    otpStore[email] = {otp, password};
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verification Email',
      html: `<h1>Your OTP for signup at MyApp is: ${otp}</h1>`,
    };
    transporter.sendMail (mailOptions, (error, info) => {
      if (error) {
        console.error ('Error sending email:', error);
        return res.status (424).json ({message: 'Failed to send email'});
      } else {
        setTimeout (() => {
          delete otpStore[email];
        }, 60 * 1000 * 5);
        return res
          .status (200)
          .json ({data: info, message: 'OTP sent to email'});
      }
    });
  } catch (error) {
    console.error ('Error during signup:', error);
    return res.status (500).json ({error: 'Internal server error'});
  }
};
const handleVerifyOtp = async (req, res) => {
  console.log ('OTP verification request received');
  console.log(req.body)
  const {email, otp, name, username} = req.body;
  const storedOtpData = otpStore[email];
console.log(otp)
  if (!storedOtpData) {
    return res.status (400).json ({error: 'OTP not found or expired'});
  }
  if (storedOtpData.otp != otp) {
    return res.status (400).json ({error: 'Invalid OTP'});
  }
  try {
    const hashedPassword = await bcrypt.hash (storedOtpData.password, 10);
    const newUser = new User ({
      name,
      email,
      password: hashedPassword,
      username,
      connections: [], 
    });
    await newUser.save ();
    delete otpStore[email];
    return res.status (201).json ({message: 'User registered successfully',user:newUser});
  } catch (error) {
    console.error ('Error during user creation:', error);
    return res.status (500).json ({error: 'Failed to save user data'});
  }
};

const handleLogin = async (req, res) => {
  console.log ('Login request received');
  const {email, password} = req.body;
  try {
    const user = await User.findOne ({email});
    if (user && (await bcrypt.compare (password, user.password))) {
      return res.status (200).json ({message: 'Login successful', user});
    } else {
      return res.status (401).json ({message: 'Invalid email or password'});
    }
  } catch (error) {
    console.error ('Error during login:', error);
    return res.status (500).json ({error: 'Failed to login'});
  }
};

module.exports = {
  handleSignup,
  handleVerifyOtp,
  handleLogin,
};
