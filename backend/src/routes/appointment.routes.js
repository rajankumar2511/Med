import express from "express";
import { protect } from "../middleware/protect.js";
import { idempotencyMiddleware } from "../middleware/idempotency.middleware.js";
import {
  bookAppointment,
  getDoctorAvailability,
  getMyAppointments,
  cancelAppointment,
} from "../controllers/apointment.controller.js";

const router = express.Router();

router.post("/book", protect, idempotencyMiddleware,bookAppointment);
router.get("/availability/:doctorId", getDoctorAvailability);
router.get("/my", protect, getMyAppointments);
router.patch("/:id/cancel", protect, cancelAppointment);

export default router;
