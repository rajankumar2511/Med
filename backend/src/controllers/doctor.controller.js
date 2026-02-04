import Doctor from "../models/doctor.model.js";

/**
 * @desc    Create doctor profile
 * @route   POST /api/doctors
 * @access  Private (Doctor only)
 */
export const createDoctorProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const existingDoctor = await Doctor.findOne({ user: userId });
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
      availability,
      profileImage,
    } = req.body;

    const doctor = await Doctor.create({
      user: userId,
      name: req.user.fullName,        // ✅ FIX HERE
      specialization,
      experience,
      hospital,
      qualification,
      phone,
      consultationFee,
      availability,
      profileImage,
    });

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
    const doctors = await Doctor.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    console.error("Get All Doctors Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching doctors",
    });
  }
};
