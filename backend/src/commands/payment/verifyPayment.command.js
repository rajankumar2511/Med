import crypto from "crypto";
import { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";

export const executeVerifyPayment = async (patientId, body) => {
  const { orderId, paymentId, signature } = body;

  const payment = await prisma.payment.findUnique({
    where: { orderId },
    include: {
      appointment: {
        include: {
          doctor: {
            include: {
              user: {
                select: {
                  fullName: true,
                  email: true,
                },
              },
            },
          },
          patient: {
            select: {
              fullName: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!payment) {
    throw new AppError("Payment not found", 404);
  }

  if (payment.patientId !== patientId) {
    throw new AppError("Unauthorized", 403);
  }

  if (payment.status !== "PENDING") {
    throw new AppError("Payment already verified", 400);
  }

  const expectedSignature = crypto
    .createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET || "dummy_secret"
    )
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  if (expectedSignature !== signature) {
    await prisma.payment.update({
      where: { orderId },
      data: {
        status: "FAILED",
        failureReason: "Invalid payment signature",
      },
    });

    throw new AppError("Invalid payment signature", 400);
  }

  await prisma.$transaction(
    async (tx) => {
      // 1. Mark payment successful
      await tx.payment.update({
        where: { orderId },
        data: {
          status: "SUCCESS",
        },
      });

      // 2. Confirm appointment
      await tx.appointment.update({
        where: {
          id: payment.appointmentId,
        },
        data: {
          status: "booked",
        },
      });

      // 3. Write Outbox Event
      await tx.outboxEvent.create({
        data: {
          eventType: "APPOINTMENT_BOOKED",
          payload: {
            appointmentId: payment.appointment.id,

            patientEmail: payment.appointment.patient.email,
            patientName: payment.appointment.patient.fullName,

            doctorEmail: payment.appointment.doctor.user.email,
            doctorName: payment.appointment.doctor.user.fullName,

            appointmentDate: payment.appointment.date,
            appointmentHour: payment.appointment.hour,
            tokenNumber: payment.appointment.tokenNumber,
          },
        },
      });
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    }
  );

  return {
    success: true,
    message: "Payment verified successfully",
    verified: true,
  };
};