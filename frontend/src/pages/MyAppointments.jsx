import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getMyAppointmentsApi,
  cancelAppointmentApi,
  createOrderApi,
  payOrderApi,
  verifyPaymentApi,
} from "../lib/api";

const statusBadgeStyles = {
  pending_payment: "bg-yellow-100 text-yellow-800 border-yellow-400",
  booked: "bg-green-100 text-green-800 border-green-400",
  completed: "bg-blue-100 text-blue-800 border-blue-400",
  cancelled: "bg-red-100 text-red-800 border-red-400",
};

const statusLabels = {
  pending_payment: "Pending Payment",
  booked: "Booked",
  completed: "Completed",
  cancelled: "Cancelled",
};

const MyAppointments = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [payingId, setPayingId] = useState(null);

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

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (appointmentId) => {
    try {
      setCancellingId(appointmentId);
      await cancelAppointmentApi(appointmentId);
      toast.success("Appointment cancelled");
      window.dispatchEvent(new Event("availability:refresh"));
      await fetchAppointments();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to cancel appointment"
      );
    } finally {
      setCancellingId(null);
    }
  };

  const handlePayNow = async (appointment) => {
    const appointmentId = appointment.id ?? appointment._id;

    if (!appointmentId) return;

    try {
      setPayingId(appointmentId);
      let orderId = localStorage.getItem(`payment-order-${appointmentId}`);

      if (!orderId) {
        const orderResponse = await createOrderApi({ appointmentId });
        orderId = orderResponse?.order?.orderId ?? orderResponse?.orderId;

        if (!orderId) {
          throw new Error("Unable to create a payment order");
        }

        localStorage.setItem(`payment-order-${appointmentId}`, orderId);
      }

      const payResponse = await payOrderApi({
        orderId,
        method: "UPI",
      });

      const paymentId = payResponse?.payment?.paymentId ?? payResponse?.paymentId;
      const signature = payResponse?.payment?.signature ?? payResponse?.signature;

      if (!paymentId || !signature) {
        throw new Error("Payment confirmation was incomplete");
      }

      await verifyPaymentApi({ orderId, paymentId, signature });
      window.dispatchEvent(new Event("availability:refresh"));
      toast.success("Appointment Confirmed");
      await fetchAppointments();
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Payment could not be completed";
      toast.error(message);
    } finally {
      setPayingId(null);
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
        <p className="text-gray-500 mb-4">You have no appointments yet.</p>
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
        <h1 className="text-2xl font-bold mb-6">My Appointments</h1>

        <div className="space-y-4">
          {appointments.map((appointment) => {
            const appointmentId = appointment.id ?? appointment._id;
            const date = new Date(appointment.date);
            const status = (appointment.status || "booked").toLowerCase();
            const badgeStyle =
              statusBadgeStyles[status] || "bg-gray-100 text-gray-700 border-gray-300";
            const badgeLabel = statusLabels[status] || status;

            return (
              <div
                key={appointmentId}
                className="bg-white p-6 rounded-xl shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-lg font-semibold">
                      {appointment.doctor?.name || "Doctor"}
                    </h2>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${badgeStyle}`}
                    >
                      {badgeLabel}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {appointment.doctor?.specialization || "Specialist"}
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

                <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate(`/doctors/${appointment.doctor?._id}`)}
                    className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100"
                  >
                    View Doctor
                  </button>

                  {status === "pending_payment" ? (
                    <button
                      onClick={() => handlePayNow(appointment)}
                      disabled={payingId === appointmentId}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
                    >
                      {payingId === appointmentId ? "Processing..." : "Pay Now"}
                    </button>
                  ) : null}

                  <button
                    disabled={cancellingId === appointmentId}
                    onClick={() => handleCancel(appointmentId)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
                  >
                    {cancellingId === appointmentId ? "Cancelling..." : "Cancel"}
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
