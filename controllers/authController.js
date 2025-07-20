const User = require("../model/User");
const { generateToken } = require("../utils/generateToken");
const response = require("../utils/responceHandler");
const crypto = require("crypto"); // ✅ Native module
const sendEmail = require("../utils/sendEmail"); // you'll implement this
const bcrypt = require("bcrypt"); // Or require('bcryptjs') if you installed bcryptjs

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return response(res, 404, "User not found");

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const tokenExpiry = Date.now() + 1000 * 60 * 15;

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = tokenExpiry;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/Resetpassword?token=${resetToken}`;
    const message = `You requested a password reset. Click here to reset: ${resetUrl}`;

    await sendEmail(user.email, "Reset your password", message);

    return response(res, 200, "Reset link sent to email");
  } catch (error) {
    console.log(error);
    return response(res, 500, "Something went wrong", error.message);
  }
};
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    if (!password || password.length < 6) {
      return response(res, 400, "Password must be at least 6 characters");
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return response(res, 400, "Invalid or expired token");
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return response(res, 200, "Password has been reset successfully");
  } catch (error) {
    console.error(error);
    return response(res, 500, "Something went wrong", error.message);
  }
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password, gender, dateOfBirth } = req.body;

    //  check the existing user with email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response(res, 400, "User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      gender,
      dateOfBirth,
    });

    await newUser.save();

    const accessToken = generateToken(newUser);

    res.cookie("auth_token", accessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return response(res, 201, "User created successfully", {
      username: newUser.username,
      email: newUser.email,
    });
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error", error.message);
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return response(res, 404, "User not found with this email");
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return response(res, 404, "Invalid Password");
    }

    const accessToken = generateToken(user); // Make sure this returns a JWT

    // ✅ Set cookie correctly
    res.cookie("auth_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // ✅ Return safe user + token
    return response(res, 201, "User logged in successfully", {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      token: accessToken,
    });
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error", error.message);
  }
};

// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     console.log("email:", email);
//     console.log("password:", password);

//     const user = await User.findOne({ email });
//     if (!user) {
//       return response(res, 404, "User not found with this email");
//     }

//     console.log("user.password:", user.password);

//     const matchPassword = await bcrypt.compare(password, user.password);
//     if (!matchPassword) {
//       return response(res, 404, "Invalid Password");
//     }

//     const accessToken = generateToken(user);

//     res.cookie("auth_token", accessToken, {
//       httpOnly: true,
//       sameSite: "none",
//       secure: true,
//       maxAge: 24 * 60 * 60 * 1000 // 1 day

//     });

//     // ✅ Send full user object along with token
//     return response(res, 201, "User logged in successfully", {
//       _id: user._id,
//       username: user.username,
//       email: user.email,
//       profilePicture: user.profilePicture,
//       phone: user.phone,
//       role: user.role,
//       createdAt: user.createdAt,
//       updatedAt: user.updatedAt,
//       token: accessToken,
//     });
//   } catch (error) {
//     console.error(error);
//     return response(res, 500, "Internal Server Error", error.message);
//   }
// };

const logout = (req, res) => {
  try {
 res.cookie('auth_token', token, {
  httpOnly: true,
 secure: false, sameSite: 'Lax',

  maxAge: 24 * 60 * 60 * 1000 // 1 day
});

    return response(res, 200, "User logged out successfully");
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error", error.message);
  }
};

module.exports = {
  registerUser,
  loginUser,
  logout,
  resetPassword,
  requestPasswordReset,
};
