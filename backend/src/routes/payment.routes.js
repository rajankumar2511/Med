import express from "express";
import { protect } from "../middleware/protect.js";

import {
    createOrder,
    payOrder,
    verifyPayment,
    getPayment,
    getOrder,
} from "../controllers/payment.controller.js";

const router = express.Router();

// Create Razorpay-like Order
router.post("/create-order", protect, createOrder);

// Simulate Payment
router.post("/pay", protect, payOrder);

// Verify Payment Signature
router.post("/verify", protect, verifyPayment);

// Get Payment by Payment ID
router.get("/:paymentId", protect, getPayment);

// Get Order by Order ID
router.get("/order/:orderId", protect, getOrder);

export default router;