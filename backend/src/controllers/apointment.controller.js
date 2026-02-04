import Appointment from "../models/appointment.model.js";
import Doctor from "../models/doctor.model.js";

/* ===========================
   BOOK APPOINTMENT
=========================== */
export const bookAppointment = async (req, res) => {
  try {
    const patientId = req.user._id;
    const { doctorId, date, hour, reason } = req.body;

    // 1️⃣ Validate doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.isActive) {
      return res.status(404).json({
        message: "Doctor not found or inactive",
      });
    }

    // 2️⃣ Normalize date (strip time)
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
      return res.status(400).json({
        message: "Appointments can be booked only for today or tomorrow",
      });
    }

    // 3️⃣ Safe workingDays handling
    const workingDays = Array.isArray(doctor.workingDays)
      ? doctor.workingDays
      : [];

    const dayName = bookingDate.toLocaleDateString("en-US", {
      weekday: "long",
    });

    if (!workingDays.includes(dayName)) {
      return res.status(400).json({
        message: `Doctor does not work on ${dayName}`,
      });
    }

    // 4️⃣ Validate working hours
    const { start, end } = doctor.workingHours;

    if (hour < start || hour >= end) {
      return res.status(400).json({
        message: "Selected time is outside doctor's working hours",
      });
    }

    // 5️⃣ Prevent duplicate booking by same patient
    const existing = await Appointment.findOne({
      doctor: doctorId,
      patient: patientId,
      date: bookingDate,
      hour,
      status: "booked",
    });

    if (existing) {
      return res.status(400).json({
        message: "You already have an appointment at this time",
      });
    }

    // 6️⃣ Check capacity
    const maxPerHour = doctor.appointmentsPerHour;

    const bookedCount = await Appointment.countDocuments({
      doctor: doctorId,
      date: bookingDate,
      hour,
      status: "booked",
    });

    if (bookedCount >= maxPerHour) {
      return res.status(400).json({
        message: "This time slot is fully booked",
      });
    }

    // 7️⃣ Assign token
    const tokenNumber = bookedCount + 1;

    // 8️⃣ Create appointment
    const appointment = await Appointment.create({
      doctor: doctorId,
      patient: patientId,
      date: bookingDate,
      hour,
      tokenNumber,
      reason,
    });

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.error("Book Appointment Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "High traffic detected. Please try again.",
      });
    }

    res.status(500).json({
      message: "Server error while booking appointment",
    });
  }
};

/* ===========================
   GET DOCTOR AVAILABILITY
=========================== */
export const getDoctorAvailability = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.isActive) {
      return res.status(404).json({
        message: "Doctor not found or inactive",
      });
    }

    // Safe workingDays handling
    const workingDays = Array.isArray(doctor.workingDays)
      ? doctor.workingDays
      : [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dates = [today, tomorrow];
    const availability = {};

    const { start, end } = doctor.workingHours;
    const maxPerHour = doctor.appointmentsPerHour;

    for (const date of dates) {
      const dayName = date.toLocaleDateString("en-US", {
        weekday: "long",
      });

      const dateKey = date.toLocaleDateString("en-CA"); // YYYY-MM-DD
      availability[dateKey] = [];

      // Skip non-working days
      if (!workingDays.includes(dayName)) {
        continue;
      }

      // Fetch bookings for the day
      const bookings = await Appointment.aggregate([
        {
          $match: {
            doctor: doctor._id,
            date,
            status: "booked",
          },
        },
        {
          $group: {
            _id: "$hour",
            count: { $sum: 1 },
          },
        },
      ]);

      const bookedMap = {};
      bookings.forEach((b) => {
        bookedMap[b._id] = b.count;
      });

      for (let hour = start; hour < end; hour++) {
        const bookedCount = bookedMap[hour] || 0;

        availability[dateKey].push({
          hour,
          spotsLeft: Math.max(maxPerHour - bookedCount, 0),
          isFull: bookedCount >= maxPerHour,
        });
      }
    }

    res.status(200).json({
      success: true,
      availability,
    });
  } catch (error) {
    console.error("Get Availability Error:", error);
    res.status(500).json({
      message: "Server error while fetching availability",
    });
  }
};

/* ===========================
   GET MY APPOINTMENTS
=========================== */
export const getMyAppointments = async (req, res) => {
  try {
    const patientId = req.user._id;

    const appointments = await Appointment.find({
      patient: patientId,
      status: { $ne: "no-show" },
    })
      .populate("doctor", "name specialization hospital profileImage")
      .sort({ date: 1, hour: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error("Get My Appointments Error:", error);
    res.status(500).json({
      message: "Server error while fetching appointments",
    });
  }
};

/* ===========================
   CANCEL APPOINTMENT
=========================== */
export const cancelAppointment = async (req, res) => {
  try {
    const patientId = req.user._id;
    const { id } = req.params;

    const appointment = await Appointment.findOne({
      _id: id,
      patient: patientId,
      status: "booked",
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found or already cancelled",
      });
    }

    const now = new Date();

    const appointmentDateTime = new Date(appointment.date);
    appointmentDateTime.setHours(appointment.hour, 0, 0, 0);

    const diffMinutes = (appointmentDateTime - now) / (1000 * 60);

    if (diffMinutes < 30) {
      return res.status(400).json({
        message: "Appointments cannot be cancelled within 30 minutes",
      });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel Appointment Error:", error);
    res.status(500).json({
      message: "Server error while cancelling appointment",
    });
  }
};
