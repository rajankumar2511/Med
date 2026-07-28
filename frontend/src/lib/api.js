import { axiosInstance } from "./axios";

const normalizeDoctor = (doctor) => {
  if (!doctor || typeof doctor !== "object") return doctor;

  return {
    ...doctor,
    _id: doctor._id ?? doctor.id ?? null,
    id: doctor.id ?? doctor._id ?? null,
    name: doctor.name ?? doctor.fullName ?? doctor.user?.fullName ?? "",
  };
};

const normalizeAppointment = (appointment) => {
  if (!appointment || typeof appointment !== "object") return appointment;

  return {
    ...appointment,
    _id: appointment._id ?? appointment.id ?? null,
    id: appointment.id ?? appointment._id ?? null,
    doctor: appointment.doctor ? normalizeDoctor(appointment.doctor) : appointment.doctor,
  };
};

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};

export const login = async (loginData) => {
  try {
    const res = await axiosInstance.post("/auth/login", loginData);

    // ✅ success case
    if (res.status === 200) {
      return { success: true, data: res.data, };
    }
    // ❌ unexpected response
    else {
      return { success: false, message: "Login failed", };
    }

  } catch (error) {
    // ❌ failure case
    return {
      success: false, message: error.response?.data?.message || "Invalid credentials",
    };
  }
};

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const getMe = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return { success: true, data: res.data };
  } catch (error) {
    console.log("Error in getMe:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Unable to fetch user profile",
    };
  }
};

export const getAuthUser = async () => {
  const result = await getMe();
  return result.success ? result.data : null;
};

export const docupprof = async (profupdata) => {
  try {
    const res = await axiosInstance.post(
      "/doctor/create",
      profupdata
    );
    return res.data;
  } catch (error) {
    console.log("Error in docupprof:", error);
    throw error;
  }
};

export const docdata = async () => {
  try {
    const res = await axiosInstance.get("/doctor/getdocdata");
    const doctors = Array.isArray(res.data?.doctors)
      ? res.data.doctors.map(normalizeDoctor)
      : [];

    return {
      ...res.data,
      doctors,
    };
  } catch (error) {
    console.log("Error in docupprof:", error);
    throw error;
  }
};

export const bookAppointmentApi = async (data, idempotencyKey) => {
  try {
    const res = await axiosInstance.post(
      "/appointments/book",
      data,
      {
        headers: {
          "Idempotency-Key": idempotencyKey,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Book Appointment API Error:", error);
    throw error;
  }
};


export const getDoctorAvailabilityApi = async (doctorId) => {
  try {
    const res = await axiosInstance.get(
      `/appointments/availability/${doctorId}`
    );
    return res.data;
  } catch (error) {
    console.error("Get Availability API Error:", error);
    throw error;
  }
};


export const getMyAppointmentsApi = async () => {
  try {
    const res = await axiosInstance.get("/appointments/my");
    const appointments = Array.isArray(res.data?.appointments)
      ? res.data.appointments.map(normalizeAppointment)
      : [];

    return {
      ...res.data,
      appointments,
    };
  } catch (error) {
    console.error("Get My Appointments API Error:", error);
    throw error;
  }
};


export const cancelAppointmentApi = async (appointmentId) => {
  try {
    const res = await axiosInstance.patch(
      `/appointments/${appointmentId}/cancel`
    );
    return res.data;
  } catch (error) {
    console.error("Cancel Appointment API Error:", error);
    throw error;
  }
};

export const createOrderApi = async (data) => {
  try {
    const res = await axiosInstance.post("/payments/create-order", data);
    return res.data;
  } catch (error) {
    console.error("Create Order API Error:", error);
    throw error;
  }
};

export const payOrderApi = async (data) => {
  try {
    const res = await axiosInstance.post("/payments/pay", data);
    return res.data;
  } catch (error) {
    console.error("Pay Order API Error:", error);
    throw error;
  }
};

export const verifyPaymentApi = async (data) => {
  try {
    const res = await axiosInstance.post("/payments/verify", data);
    return res.data;
  } catch (error) {
    console.error("Verify Payment API Error:", error);
    throw error;
  }
};

export const agentAIDoctorFinder = async (symptoms) => {
  try {
    const res = await axiosInstance.post(
      "/ai/doctor-finder",
      { symptoms }
    );
    return res.data;
  } catch (error) {
    console.error("error in finding doc using Agent:", error);
    throw error;
  }
};


export const nearbydoc = async ({ lng, lat }) => {
  try {
    const res = await axiosInstance.post(
      "/map/nearby",
      {
        lng,
        lat,
      }
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("error in finding doc distance:", error);
    throw error;
  }
};

export const getmsdata = async (longitude, latitude) => {
  try {
    const res = await axiosInstance.post(
      `/medical/getmsdata`,
      {
        longitude,
        latitude,
      }
    );
    return res.data;
  } catch (error) {
    console.error("Get Availability API Error:", error);
    throw error;
  }
};