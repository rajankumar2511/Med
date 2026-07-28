import { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma.js";
import { redis } from "../../lib/redis.js";

class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const executeBookAppointment = async (req) => {
  const patientId = req.user.id;
  const { doctorId, date, hour, reason } = req.body;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const bookingDate = new Date(date);
  bookingDate.setHours(0, 0, 0, 0);

  if (
    bookingDate.getTime() !== today.getTime() &&
    bookingDate.getTime() !== tomorrow.getTime()
  ) {
    throw new AppError(
      400,
      "Appointments can be booked only for today or tomorrow"
    );
  }

  const MAX_RETRIES = 3;
  let lastError = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const appointment = await prisma.$transaction(
        async (tx) => {
          const doctor = await tx.doctor.findUnique({
            where: { id: doctorId },
          });

          if (!doctor) {
            throw new AppError(404, "Doctor not found");
          }

          if (!doctor.isActive) {
            throw new AppError(404, "Doctor is currently inactive");
          }

          const workingDays = Array.isArray(doctor.workingDays)
            ? doctor.workingDays
            : [];

          const dayName = bookingDate.toLocaleDateString("en-US", {
            weekday: "long",
          });

          if (!workingDays.includes(dayName)) {
            throw new AppError(
              400,
              `Doctor does not work on ${dayName}`
            );
          }

          if (
            hour < doctor.workingStart ||
            hour >= doctor.workingEnd
          ) {
            throw new AppError(
              400,
              "Selected time is outside doctor's working hours"
            );
          }

          // Prevent duplicate appointment by same patient
          const existing = await tx.appointment.findFirst({
            where: {
              doctorId,
              patientId,
              date: bookingDate,
              hour,
              status: {
                in: ["pending_payment", "booked"],
              },
            },
          });

          if (existing) {
            throw new AppError(
              400,
              "You already have an appointment at this time"
            );
          }

          // Count reserved + booked slots
          const bookedCount = await tx.appointment.count({
            where: {
              doctorId,
              date: bookingDate,
              hour,
              status: {
                in: ["pending_payment", "booked"],
              },
            },
          });

          if (bookedCount >= doctor.appointmentsPerHour) {
            throw new AppError(
              400,
              "This time slot is fully booked"
            );
          }

          // Create appointment in pending state
          const appointment = await tx.appointment.create({
            data: {
              doctorId,
              patientId,
              date: bookingDate,
              hour,
              tokenNumber: bookedCount + 1,
              reason,
              status: "pending_payment",
            },
          });

          return appointment;
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          timeout: 5000,
        }
      );

      // Invalidate cached availability
      await redis.del(`availability:v1:${doctorId}`);

      return {
        success: true,
        message: "Appointment created. Payment required to confirm booking.",
        appointment,
      };
    } catch (error) {
      lastError = error;

      if (error.code === "P2034" && attempt < MAX_RETRIES) {
        await new Promise((resolve) =>
          setTimeout(resolve, 100 * attempt)
        );
        continue;
      }

      break;
    }
  }

  if (lastError?.code === "P2034") {
    throw new AppError(
      409,
      "Booking temporarily unavailable due to high demand. Please try again."
    );
  }

  throw lastError;
};

export { AppError };