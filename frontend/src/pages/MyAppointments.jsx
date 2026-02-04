import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getMyAppointmentsApi, cancelAppointmentApi } from "../lib/api";

const MyAppointments = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getMyAppointmentsApi();
        setAppointments(data.appointments || []);
      } catch (error) {
        toast.error("Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    try {
      setCancellingId(id);
      await cancelAppointmentApi(id);
      toast.success("Appointment cancelled");

      setAppointments((prev) =>
        prev.filter((a) => a._id !== id)
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to cancel appointment"
      );
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Loading your appointments...
      </p>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">
          You have no appointments yet.
        </p>
        <button
          onClick={() => navigate("/doctors")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Book a Doctor
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          My Appointments
        </h1>

        <div className="space-y-4">
          {appointments.map((appointment) => {
            const date = new Date(appointment.date);

            return (
              <div
                key={appointment._id}
                className="bg-white p-6 rounded-xl shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center"
              >
                {/* Doctor Info */}
                <div>
                  <h2 className="text-lg font-semibold">
                    {appointment.doctor.name}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {appointment.doctor.specialization}
                  </p>

                  <p className="text-sm mt-1">
                    <span className="font-medium">Date:</span>{" "}
                    {date.toLocaleDateString("en-IN")}
                  </p>

                  <p className="text-sm">
                    <span className="font-medium">Time:</span>{" "}
                    {appointment.hour}:00 – {appointment.hour + 1}:00
                  </p>

                  <p className="text-sm">
                    <span className="font-medium">Token:</span>{" "}
                    #{appointment.tokenNumber}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-4 sm:mt-0 flex gap-3">
                  <button
                    onClick={() =>
                      navigate(
                        `/doctors/${appointment.doctor._id}`
                      )
                    }
                    className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100"
                  >
                    View Doctor
                  </button>

                  <button
                    disabled={cancellingId === appointment._id}
                    onClick={() =>
                      handleCancel(appointment._id)
                    }
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
                  >
                    {cancellingId === appointment._id
                      ? "Cancelling..."
                      : "Cancel"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;
