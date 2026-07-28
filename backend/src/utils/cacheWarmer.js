import prisma from "../lib/prisma.js";
import { redis } from "../lib/redis.js";

const DOCTORS_CACHE_KEY = "all-doctors:v1";
const DOCTORS_CACHE_TTL = 300;

export async function warmDoctorsCache() {
  try {
    console.log("🔥 Warming doctors cache...");

    const doctors = await prisma.doctor.findMany({
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            profilePic: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const response = {
      success: true,
      doctors,
    };

    await redis.setEx(
      DOCTORS_CACHE_KEY,
      DOCTORS_CACHE_TTL,
      JSON.stringify(response)
    );

    console.log(`✅ Warmed ${doctors.length} doctors into Redis`);
  } catch (err) {
    console.error("❌ Cache warming failed:", err.message);
  }
}