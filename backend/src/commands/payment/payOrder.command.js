import crypto from "crypto";
import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";

export const executePayOrder = async (patientId, body) => {
  const { orderId, method } = body;

  if (!orderId) {
    throw new AppError("Order ID is required", 400);
  }

  const payment = await prisma.payment.findUnique({
    where: { orderId },
  });

  if (!payment) {
    throw new AppError("Order not found", 404);
  }

  if (payment.patientId !== patientId) {
    throw new AppError("Unauthorized", 403);
  }

  if (payment.status !== "PENDING") {
    throw new AppError("Order already processed", 400);
  }

  // Simulate payment gateway failure (optional)
  const paymentSuccess = true;

  if (!paymentSuccess) {
    await prisma.payment.update({
      where: { orderId },
      data: {
        status: "FAILED",
        method,
        failureReason: "Payment Failed",
      },
    });

    throw new AppError("Payment Failed", 400);
  }

  // Generate Razorpay-like Payment ID
  const paymentId = `pay_${crypto.randomBytes(12).toString("hex")}`;

  // Generate Razorpay-like Signature
  const signature = crypto
    .createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET || "dummy_secret"
    )
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  // Store payment details but keep status PENDING
  const updatedPayment = await prisma.payment.update({
    where: { orderId },
    data: {
      paymentId,
      method,
      signature,
    },
  });

  return {
    success: true,
    message: "Payment processed successfully. Please verify payment.",
    payment: {
      orderId: updatedPayment.orderId,
      paymentId: updatedPayment.paymentId,
      signature: updatedPayment.signature,
      amount: updatedPayment.amount,
      currency: updatedPayment.currency,
      status: updatedPayment.status, // still PENDING
    },
  };
};