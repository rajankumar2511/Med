import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: Date,
      required: true,
      set: (d) => {
        const date = new Date(d);
        date.setHours(0, 0, 0, 0);
        return date;
      },
    },

    hour: {
      type: Number,
      required: true,
      min: 0,
      max: 23,
    },

    tokenNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["booked", "cancelled", "completed", "no-show"],
      default: "booked",
      index: true,
    },

    reason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// 🧠 Only this index is REQUIRED
appointmentSchema.index(
  { doctor: 1, date: 1, hour: 1, tokenNumber: 1 },
  { unique: true }
);

appointmentSchema.index(
  { doctor: 1, date: 1, hour: 1 }
);

export default mongoose.model("Appointment", appointmentSchema);
