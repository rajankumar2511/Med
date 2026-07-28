import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    // 🔗 Link doctor to auth user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // 👨‍⚕️ Basic Info
    name: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true },
    experience: { type: Number, required: true },

    // 🏥 Professional Info
    hospital: String,
    qualification: String,

    // 📞 Contact
    phone: String,

    // 💰 Consultation
    consultationFee: {
      type: Number,
      default: 0,
    },

    // 📅 Doctor-selected working days (SOURCE OF TRUTH)
    workingDays: {
      type: [String],
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      required: true,
    },

    // 🕒 Same working hours for all working days
    workingHours: {
      start: {
        type: Number,
        default: 9,
        min: 0,
        max: 23,
      },
      end: {
        type: Number,
        default: 17,
        min: 1,
        max: 24,
      },
    },

    // ⏱️ Capacity per hour
    appointmentsPerHour: {
      type: Number,
      default: 6,
      min: 1,
      max: 20,
    },
    // 📍 Clinic / Hospital Location
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: (val) => val.length === 2,
          message: "Coordinates must be [longitude, latitude]",
        },
      },

      address: {
        type: String,
        required: true,
      },
      placeId: {
        type: String, // Google Maps Place ID (optional but very useful)
      },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
    },


    // 🖼️ Profile Image
    profileImage: String,

    // ⭐ Reviews
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },

    // ✅ Status
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
doctorSchema.index({ location: "2dsphere" });

export default mongoose.model("Doctor", doctorSchema);
