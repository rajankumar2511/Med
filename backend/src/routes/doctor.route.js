import express from "express";
import { protect } from "../middleware/protect.js";
import { isDoctor } from "../middleware/role.middleware.js";
import { createDoctorProfile,getAllDoctors } from "../controllers/doctor.controller.js";


const router = express.Router();

router.post(
  "/create",
  protect,     // adds req.user
  isDoctor,    // checks role
  createDoctorProfile
);
router.get("/getdocdata",getAllDoctors)

export default router;