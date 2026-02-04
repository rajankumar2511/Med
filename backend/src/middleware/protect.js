import jwt from "jsonwebtoken";
import DocUser from "../models/user.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Bearer token (optional – Postman, mobile)
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2️⃣ Cookie token (main – browser)
    if (!token && req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    // 3️⃣ No token found
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // 4️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // 5️⃣ Get user from DB
    const user = await DocUser.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Account is blocked" });
    }

    // 🔑 Attach user to request
    req.user = user;

    // 🧪 Debug logs (optional – remove later)
    console.log("🔐 protect middleware hit");
    console.log("👤 user:", user.email, user.role);

    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
