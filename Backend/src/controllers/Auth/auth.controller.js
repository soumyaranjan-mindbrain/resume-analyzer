const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { generateAccessToken, generateRefreshToken } = require("../../utils/generateToken");

// Helper to send access and refresh tokens in HTTP-only cookies
const sendTokens = async (res, user, message = "Login successful", status = 200) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  res
    .cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    })
    .status(status)
    .json({
      msg: message,
      token: accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || "",
        profilePic: user.profilePic || "",
        github: user.github || "",
        linkedin: user.linkedin || "",
      },
    });
};

// Registration
const register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    const allowedRoles = ["admin", "student"];
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Name, email, password and role are required" });
    }
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role. Use 'admin' or 'student'" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone: phone || "",
    });

    await newUser.save();

    // Automatically log in the user after registration
    await sendTokens(res, newUser, "User registered and logged in successfully", 201);

  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({
        error: `The ${field} "${err.keyValue[field]}" is already in use.`,
      });
    }

    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: errors.join(", ") });
    }

    res.status(500).json({ error: err.message });
  }
};

// Login (Admin & User)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    await sendTokens(res, user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Refresh Token (Admin & User)
const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refresh_token;
    if (!token) return res.status(401).json({ error: "No refresh token provided" });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (!user.refreshToken || user.refreshToken !== token) {
      return res.status(401).json({ error: "Refresh token mismatch" });
    }

    await sendTokens(res, user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Logout (works for any role)
const logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    const refreshTokenCookie = req.cookies.refresh_token;
    let user = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await User.findById(decoded.id);
        if (user) {
          user.refreshToken = "";
          await user.save();
        }
      } catch (err) {
        // invalid token is treated as already logged out
      }
    }

    res
      .cookie("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(0),
      })
      .cookie("refresh_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(0),
      })
      .status(200)
      .json({
        msg: "Logged out successfully",
        user: user
          ? {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone || "",
            profilePic: user.profilePic || "",
            github: user.github || "",
            linkedin: user.linkedin || "",
          }
          : null,
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMe = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await User.findById(req.user.id).select("name email role phone profilePic github linkedin");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      msg: "Authenticated user",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || "",
        profilePic: user.profilePic || "",
        github: user.github || "",
        linkedin: user.linkedin || "",
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "Old password and new password are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ msg: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login, refreshToken, logout, getMe, changePassword };

