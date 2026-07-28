import prisma from "../../lib/prisma.js";
import { redis } from "../../lib/redis.js";

const CACHE_TTL = 60;

export const executeGetDoctorAvailability = async (req) => {
  const { doctorId } = req.params;
  const cacheKey = `availability:v1:${doctorId}`;

  try {
    const cached = await redis.get(cacheKey);

    if (cached) {
      console.log("✅ Redis HIT appointment");
      return JSON.parse(cached);
    }

    console.log("❌ Redis MISS");
  } catch (err) {
    console.error("Redis GET Error:", err.message);
  }

  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId },
  });

  if (!doctor || !doctor.isActive) {
    const error = new Error("Doctor not found or inactive");
    error.statusCode = 404;
    throw error;
  }

  const workingDays = Array.isArray(doctor.workingDays)
    ? doctor.workingDays
    : [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const dates = [today, tomorrow];
  const availability = {};

  for (const date of dates) {
    const dayName = date.toLocaleDateString("en-US", {
      weekday: "long",
    });

    const dateKey = date.toLocaleDateString("en-CA");

    availability[dateKey] = [];

    if (!workingDays.includes(dayName)) continue;

    const bookings = await prisma.appointment.groupBy({
      by: ["hour"],
      where: {
        doctorId,
        date,
        status: {
          in: ["pending_payment", "booked"],
        },
      },
      _count: true,
    });

    const bookedMap = {};

    bookings.forEach((b) => {
      bookedMap[b.hour] = b._count;
    });

    for (
      let hour = doctor.workingStart;
      hour < doctor.workingEnd;
      hour++
    ) {
      const bookedCount = bookedMap[hour] || 0;

      availability[dateKey].push({
        hour,
        spotsLeft: Math.max(
          doctor.appointmentsPerHour - bookedCount,
          0
        ),
        isFull: bookedCount >= doctor.appointmentsPerHour,
      });
    }
  }

  const response = {
    success: true,
    availability,
  };

  try {
    await redis.setEx(
      cacheKey,
      CACHE_TTL,
      JSON.stringify(response)
    );

    console.log("💾 Availability cached");
  } catch (err) {
    console.error("Redis SET Error:", err.message);
  }

  return response;
};