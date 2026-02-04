import { axiosInstance } from "./axios";

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

export const getAuthUser = async () => {
    try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
    } catch (error) {
        console.log("Error in getAuthUser:", error);
        return null;
    }
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
        const res = await axiosInstance.get(
            "/doctor/getdocdata")
        return res.data;
    } catch (error) {
        console.log("Error in docupprof:", error);
        throw error;
    }
}

export const bookAppointmentApi = async (data) => {
  try {
    const res = await axiosInstance.post(
      "/appointments/book",
      data
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
    const res = await axiosInstance.get(
      "/appointments/my"
    );
    return res.data;
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