import crypto from "crypto";
import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";

export const executeCreateOrder = async (patientId, body) => {
  const { appointmentId } = body;

  if (!appointmentId) {
    throw new AppError("Appointment ID is required", 400);
  }

  // Find appointment and verify ownership
  const appointment = await prisma.appointment.findUnique({
    where: {
      id: appointmentId,
    },
    include: {
      doctor: {
        select: {
          id: true,
          consultationFee: true,
        },
      },
    },
  });

  if (!appointment) {
    throw new AppError("Appointment not found", 404);
  }

  if (appointment.patientId !== patientId) {
    throw new AppError("Unauthorized", 403);
  }

  if (appointment.status !== "pending_payment") {
    throw new AppError(
      "Payment can only be made for pending appointments",
      400
    );
  }

  // Prevent duplicate payment orders
  const existingPayment = await prisma.payment.findUnique({
    where: {
      appointmentId,
    },
  });

  if (existingPayment) {
    throw new AppError(
      "Payment order already exists for this appointment",
      400
    );
  }

  // Generate Razorpay-like Order ID
  const orderId = `order_${crypto.randomBytes(12).toString("hex")}`;

  const payment = await prisma.payment.create({
    data: {
      orderId,
      amount: appointment.doctor.consultationFee,
      currency: "INR",
      status: "PENDING",
      patientId,
      doctorId: appointment.doctor.id,
      appointmentId,
    },
  });

  return {
    success: true,
    message: "Order created successfully",
    order: {
      orderId: payment.orderId,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      key: process.env.RAZORPAY_KEY_ID || "rzp_test_dummy_key",
    },
  };
};