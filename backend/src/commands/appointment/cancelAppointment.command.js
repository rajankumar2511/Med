import prisma from "../../lib/prisma.js";
import { redis } from "../../lib/redis.js";
import { AppError } from "./bookAppointment.command.js";

export const executeCancelAppointment = async (req) => {
  const patientId = req.user.id;
  const { id } = req.params;

  const appointment = await prisma.appointment.findFirst({
    where: {
      id,
      patientId,
      status: "booked",
    },
  });

  if (!appointment) {
    throw new AppError(
      404,
      "Appointment not found or already cancelled"
    );
  }

  const now = new Date();

  const appointmentDateTime = new Date(appointment.date);
  appointmentDateTime.setHours(appointment.hour, 0, 0, 0);

  const diffMinutes = (appointmentDateTime - now) / (1000 * 60);

  if (diffMinutes < 30) {
    throw new AppError(
      400,
      "Appointments cannot be cancelled within 30 minutes"
    );
  }

  const updatedAppointment = await prisma.appointment.update({
    where: { id },
    data: {
      status: "cancelled",
    },
  });

  try {
    const cacheKey = `availability:v1:${appointment.doctorId}`;

    await redis.del(cacheKey);

    console.log(`🗑 Cache invalidated: ${cacheKey}`);
  } catch (err) {
    console.error("Redis DEL Error:", err.message);
  }

  return {
    success: true,
    message: "Appointment cancelled successfully",
    appointment: updatedAppointment,
  };
};