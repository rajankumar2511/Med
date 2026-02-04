import express from "express";
const router = express.Router();
import {signup,login,logout } from "../controllers/auth.controller.js";
import { protect } from "../middleware/protect.js";

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

export default router;