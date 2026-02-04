import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getDoctorAvailabilityApi,
  bookAppointmentApi,
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
  const [booking, setBooking] = useState(false);

  /* ===========================
     Helpers
  =========================== */

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

  /* ===========================
     Fetch Availability
  =========================== */
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const data = await getDoctorAvailabilityApi(doctorId);

        // Sort dates
        const dates = Object.keys(data.availability || {}).sort();
        const sortedAvailability = {};

        dates.forEach((date) => {
          sortedAvailability[date] = data.availability[date];
        });

        setAvailability(sortedAvailability);

        // Select first date that actually has slots
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

    fetchAvailability();
  }, [doctorId]);

  /* ===========================
     Handle Booking
  =========================== */
  const handleBookAppointment = async () => {
    if (!selectedDate || selectedHour === null) {
      toast.warn("Please select a date and time slot");
      return;
    }

    try {
      setBooking(true);

      await bookAppointmentApi({
        doctorId,
        date: selectedDate,
        hour: selectedHour,
        reason,
      });

      toast.success("Appointment booked successfully");
      navigate("/my-appointments");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Booking failed"
      );
    } finally {
      setBooking(false);
    }
  };

  /* ===========================
     Derived State
  =========================== */
  const slotsForSelectedDate = availability[selectedDate] || [];
  const noSlots = slotsForSelectedDate.length === 0;

  /* ===========================
     UI States
  =========================== */
  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600">
        Loading availability...
      </p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Book Appointment
      </h1>

      {/* ===========================
          DATE SELECTION
      =========================== */}
      <div className="flex flex-wrap gap-4 mb-6">
        {Object.keys(availability).map((date) => {
          const hasSlots = availability[date]?.length > 0;

          return (
            <button
              key={date}
              onClick={() => {
                setSelectedDate(date);
                setSelectedHour(null);
              }}
              className={`px-4 py-2 rounded-lg border transition ${
                selectedDate === date
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

      {/* ===========================
          TIME SLOTS
      =========================== */}
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
              onClick={() => setSelectedHour(slot.hour)}
              className={`p-3 rounded-lg border text-center transition ${
                slot.isFull
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
                {slot.isFull
                  ? "FULL"
                  : `${slot.spotsLeft} spots left`}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* ===========================
          REASON
      =========================== */}
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

      {/* ===========================
          ACTION
      =========================== */}
      <button
        onClick={handleBookAppointment}
        disabled={booking || noSlots}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400"
      >
        {booking ? "Booking..." : "Book Appointment"}
      </button>
    </div>
  );
};

export default BookAppointment;
