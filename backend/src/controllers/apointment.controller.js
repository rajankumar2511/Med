import {
  executeBookAppointment,
  AppError,
} from "../commands/appointment/bookAppointment.command.js";

import { executeCancelAppointment } from "../commands/appointment/cancelAppointment.command.js";

import { executeGetDoctorAvailability } from "../queries/appointment/getDoctorAvailability.query.js";

import { executeGetMyAppointments } from "../queries/appointment/getMyAppointments.query.js";

/* ===========================
   BOOK APPOINTMENT
=========================== */
export const bookAppointment = async (req, res) => {
  try {
    const result = await executeBookAppointment(req);
    return res.status(201).json(result);
  } catch (error) {
    console.error("Book Appointment Error:", error);

    if (error instanceof AppError || error.statusCode) {
      return res.status(error.statusCode).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Server error while booking appointment",
    });
  }
};

/* ===========================
   GET DOCTOR AVAILABILITY
=========================== */
export const getDoctorAvailability = async (req, res) => {
  try {
    const result = await executeGetDoctorAvailability(req);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Availability Error:", error);

    return res.status(error.statusCode || 500).json({
      message: error.message || "Server error while fetching availability",
    });
  }
};

/* ===========================
   GET MY APPOINTMENTS
=========================== */
export const getMyAppointments = async (req, res) => {
  try {
    const result = await executeGetMyAppointments(req);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get My Appointments Error:", error);

    return res.status(500).json({
      message: "Server error while fetching appointments",
    });
  }
};

/* ===========================
   CANCEL APPOINTMENT
=========================== */
export const cancelAppointment = async (req, res) => {
  try {
    const result = await executeCancelAppointment(req);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Cancel Appointment Error:", error);

    if (error instanceof AppError || error.statusCode) {
      return res.status(error.statusCode).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Server error while cancelling appointment",
    });
  }
};