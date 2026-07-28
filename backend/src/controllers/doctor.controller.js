import prisma from "../lib/prisma.js";
import { redis } from "../lib/redis.js";
/**
 * @desc    Create doctor profile
 * @route   POST /api/doctors
 * @access  Private (Doctor only)
 */

const DOCTORS_CACHE_KEY = "all-doctors:v1";
const DOCTORS_CACHE_TTL = 300;


export const createDoctorProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const existingDoctor = await prisma.doctor.findUnique({
      where: { userId },
    });
    if (existingDoctor) {
      return res.status(400).json({
        message: "Doctor profile already exists",
      });
    }

    const {
      specialization,
      experience,
      hospital,
      qualification,
      phone,
      consultationFee,
      workingDays,
      workingStart,
      workingEnd,
      appointmentsPerHour,
      profileImage,
      location,
    } = req.body;

    if (
      !location ||
      !location.lat ||
      !location.lng ||
      !location.address
    ) {
      return res.status(400).json({
        success: false,
        message: "Clinic location is required",
      });
    }

    if (!workingDays || !Array.isArray(workingDays) || workingDays.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Working days are required",
      });
    }

    const doctor = await prisma.doctor.create({
      data: {
        userId,
        specialization,
        experience,
        hospital,
        qualification,
        phone,
        consultationFee: consultationFee || 0,
        workingDays,
        workingStart: workingStart || 9,
        workingEnd: workingEnd || 17,
        appointmentsPerHour: appointmentsPerHour || 6,
        profileImage,
        latitude: location.lat,
        longitude: location.lng,
        address: location.address,
        placeId: location.placeId || null,
        city: location.city || null,
        state: location.state || null,
      },
      include: {
        user: true,
      },
    });
    try {
      await redis.del(DOCTORS_CACHE_KEY);
      console.log("🗑 Doctors cache invalidated");
    } catch (err) {
      console.error("Redis DEL Error:", err.message);
    }
    res.status(201).json({
      success: true,
      message: "Doctor profile created successfully",
      doctor,
    });
  } catch (error) {
    console.error("Create Doctor Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating doctor profile",
    });
  }
};


export const getAllDoctors = async (req, res) => {

  try {
    const cached = await redis.get(DOCTORS_CACHE_KEY);

    if (cached) {
      console.log("✅ Redis HIT doctor controller");
      return res.status(200).json(JSON.parse(cached));
    }

    console.log("❌ Redis MISS");
  } catch (err) {
    console.error("Redis GET Error:", err.message);
  }
  try {
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

    try {
      await redis.setEx(
        DOCTORS_CACHE_KEY,
        DOCTORS_CACHE_TTL,
        JSON.stringify(response)
      );

      console.log("💾 Doctors cached");
    } catch (err) {
      console.error("Redis SET Error:", err.message);
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error("Get All Doctors Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching doctors",
    });
  }
};
