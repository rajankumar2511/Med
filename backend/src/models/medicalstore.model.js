import mongoose from "mongoose";

const medicalStoreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    owner_name: {
      type: String,
      required: true,
      trim: true,
    },

    license_number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      trim: true,
    },

    // 🔥 Improved Location Structure
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
        type: String, // Google Maps Place ID
      },

      city: {
        type: String,
        trim: true,
      },

      state: {
        type: String,
        trim: true,
      },
    },

    is_verified: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// 🔥 Required for geo queries
medicalStoreSchema.index({ location: "2dsphere" });

export default mongoose.model("MedicalStore", medicalStoreSchema);
