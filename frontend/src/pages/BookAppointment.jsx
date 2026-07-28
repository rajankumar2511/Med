import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getDoctorAvailabilityApi,
  bookAppointmentApi,
  createOrderApi,
  payOrderApi,
  verifyPaymentApi,
} from "../lib/api.js";
import { toast } from "react-toastify";

const BookAppointment = () => {
  const { id } = useParams();
  const doctorId = id;
  const navigate = useNavigate();

  const [availability, setAvailability] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState("idle");
  const [paymentError, setPaymentError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [createdAppointmentId, setCreatedAppointmentId] = useState(null);

  const idempotencyKeyRef = useRef(null);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

  const fetchAvailability = async () => {
    try {
      const data = await getDoctorAvailabilityApi(doctorId);
      const dates = Object.keys(data.availability || {}).sort();
      const sortedAvailability = {};

      dates.forEach((date) => {
        sortedAvailability[date] = data.availability[date];
      });

      setAvailability(sortedAvailability);

      const firstAvailableDate = dates.find(
        (d) => sortedAvailability[d]?.length > 0
      );

      setSelectedDate(firstAvailableDate || dates[0] || "");
      setSelectedHour(null);
    } catch (error) {
      toast.error("Failed to load availability");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();

    const handleRefresh = () => {
      fetchAvailability();
    };

    window.addEventListener("availability:refresh", handleRefresh);

    return () => {
      window.removeEventListener("availability:refresh", handleRefresh);
    };
  }, [doctorId]);

  const handleBookAppointment = async () => {
    if (!selectedDate || selectedHour === null) {
      toast.warn("Please select a date and time slot");
      return;
    }

    if (processing) return;

    try {
      setProcessing(true);
      setPaymentError("");
      setPaymentStep("booking");

      let appointmentId = createdAppointmentId;

      if (!appointmentId) {
        if (!idempotencyKeyRef.current) {
          idempotencyKeyRef.current = crypto.randomUUID();
        }

        const bookedAppointment = await bookAppointmentApi(
          {
            doctorId,
            date: selectedDate,
            hour: selectedHour,
            reason,
          },
          idempotencyKeyRef.current
        );

        appointmentId =
          bookedAppointment?.appointment?.id ??
          bookedAppointment?.appointment?._id ??
          bookedAppointment?.id ??
          bookedAppointment?.appointment?.appointmentId;

        if (!appointmentId) {
          throw new Error("Appointment could not be created");
        }

        setCreatedAppointmentId(appointmentId);
      }

      setPaymentStep("creating-order");
      let orderId = localStorage.getItem(`payment-order-${appointmentId}`);

      if (!orderId) {
        const orderResponse = await createOrderApi({ appointmentId });
        orderId = orderResponse?.order?.orderId ?? orderResponse?.orderId;

        if (!orderId) {
          throw new Error("Payment order could not be created");
        }

        localStorage.setItem(`payment-order-${appointmentId}`, orderId);
      }

      setPaymentStep("paying");
      const payResponse = await payOrderApi({
        orderId,
        method: paymentMethod,
      });

      const paymentId = payResponse?.payment?.paymentId ?? payResponse?.paymentId;
      const signature = payResponse?.payment?.signature ?? payResponse?.signature;

      if (!paymentId || !signature) {
        throw new Error("Payment confirmation was incomplete");
      }

      setPaymentStep("verifying");
      const verifyResponse = await verifyPaymentApi({
        orderId,
        paymentId,
        signature,
      });

      if (verifyResponse?.success !== true && verifyResponse?.verified !== true) {
        throw new Error("Payment verification failed");
      }

      window.dispatchEvent(new Event("availability:refresh"));
      toast.success("Appointment Confirmed");
      idempotencyKeyRef.current = null;
      navigate("/my-appointments");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Payment could not be completed";

      setPaymentError(message);
      toast.error(message);
      idempotencyKeyRef.current = null;
    } finally {
      setProcessing(false);
      setPaymentStep("idle");
    }
  };

  const slotsForSelectedDate = availability[selectedDate] || [];
  const noSlots = slotsForSelectedDate.length === 0;

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600">
        Loading availability...
      </p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Book Appointment</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        {Object.keys(availability).map((date) => {
          const hasSlots = availability[date]?.length > 0;

          return (
            <button
              key={date}
              onClick={() => {
                setSelectedDate(date);
                setSelectedHour(null);
                setCreatedAppointmentId(null);
              }}
              className={`px-4 py-2 rounded-lg border transition ${selectedDate === date
                ? "bg-blue-600 text-white"
                : hasSlots
                  ? "bg-white hover:bg-gray-100"
                  : "bg-gray-200 text-gray-500"
                }`}
            >
              {formatDate(date)}
            </button>
          );
        })}
      </div>

      {noSlots ? (
        <div className="text-center text-gray-500 mb-6">
          Doctor is not available on this day
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {slotsForSelectedDate.map((slot) => (
            <button
              key={`${selectedDate}-${slot.hour}`}
              disabled={slot.isFull}
              onClick={() => {
                setSelectedHour(slot.hour);
                setCreatedAppointmentId(null);
              }}
              className={`p-3 rounded-lg border text-center transition ${slot.isFull
                ? "bg-gray-200 cursor-not-allowed"
                : selectedHour === slot.hour
                  ? "bg-green-600 text-white"
                  : "bg-white hover:bg-gray-100"
                }`}
            >
              <p className="font-medium">
                {slot.hour}:00 – {slot.hour + 1}:00
              </p>
              <p className="text-sm">
                {slot.isFull ? "FULL" : `${slot.spotsLeft} spots left`}
              </p>
            </button>
          ))}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">
          Payment Method
        </label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full border rounded-lg p-2"
          disabled={processing}
        >
          <option value="UPI">UPI</option>
          <option value="CARD">Card</option>
          <option value="NETBANKING">Net Banking</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">
          Reason for visit (optional)
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          className="w-full border rounded-lg p-2"
          placeholder="Describe your issue..."
        />
      </div>

      {paymentError ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">Payment could not be completed</p>
          <p className="mt-1">{paymentError}</p>
        </div>
      ) : null}

      <button
        onClick={handleBookAppointment}
        disabled={processing || noSlots}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400"
      >
        {processing
          ? paymentStep === "booking"
            ? "Creating appointment..."
            : paymentStep === "creating-order"
              ? "Creating payment order..."
              : paymentStep === "paying"
                ? "Processing payment..."
                : paymentStep === "verifying"
                  ? "Verifying payment..."
                  : "Processing..."
          : paymentError
            ? "Retry Payment"
            : "Confirm & Pay"}
      </button>
    </div>
  );
};

export default BookAppointment;
