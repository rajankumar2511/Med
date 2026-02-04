import DocUser from "../models/user.js";
import jwt from "jsonwebtoken";

/* 🔒 ONE COOKIE CONFIG (USED EVERYWHERE) */
const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: false, // true in production
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/* 🔐 PUBLIC ROLES ONLY */
const allowedRoles = ["patient", "doctor"];

/* ===================== SIGNUP ===================== */
export async function signup(req, res) {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await DocUser.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await DocUser.create({
      fullName,
      email: email.toLowerCase(),
      password,
      profilePic: randomAvatar,
      role,
    });

    const token = jwt.sign(
      {
        userId: newUser._id,
        role: newUser.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, cookieOptions);

    const userData = newUser.toObject();
    delete userData.password;

    res.status(201).json({
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/* ===================== LOGIN ===================== */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await DocUser.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid email or password" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Account is blocked" });
    }

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, cookieOptions);

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/* ===================== LOGOUT ===================== */
export function logout(req, res) {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
}
