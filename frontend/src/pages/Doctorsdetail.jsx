import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDoctors } from "../context/DoctorContext";

const Doctorsdetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { doctors } = useDoctors();

  // Find doctor from cached list
  const doctor = doctors.find((d) => d._id === id);

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">
          Doctor not found. Please go back to doctors list.
        </p>
      </div>
    );
  }

  const workingDays = Array.isArray(doctor.workingDays)
    ? doctor.workingDays
    : [];

  const workingHours = doctor.workingHours || {};

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">{doctor.name}</h1>
            <p className="text-gray-500 mt-1">
              {doctor.specialization}
            </p>
          </div>

          <div className="mt-4 sm:mt-0 text-green-600 text-xl font-semibold">
            ₹{doctor.consultationFee}
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6" />

        {/* Core Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <p>
            <span className="font-medium">Experience:</span>{" "}
            {doctor.experience} years
          </p>

          <p>
            <span className="font-medium">Qualification:</span>{" "}
            {doctor.qualification || "Not specified"}
          </p>

          <p>
            <span className="font-medium">Hospital / Clinic:</span>{" "}
            {doctor.hospital || "Not specified"}
          </p>

          <p>
            <span className="font-medium">Phone:</span>{" "}
            {doctor.phone || "Not available"}
          </p>
        </div>

        {/* Availability (NEW MODEL) */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">
            Availability
          </h2>

          {workingDays.length > 0 && workingHours.start !== undefined ? (
            <div className="space-y-3 text-sm">
              <p>
                <span className="font-medium">Working Days:</span>{" "}
                {workingDays.join(", ")}
              </p>

              <p>
                <span className="font-medium">Working Hours:</span>{" "}
                {workingHours.start}:00 – {workingHours.end}:00
              </p>

              <p>
                <span className="font-medium">
                  Appointments per hour:
                </span>{" "}
                {doctor.appointmentsPerHour || "N/A"}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Availability not configured yet.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() =>
              navigate(`/book-appointment/${doctor._id}`)
            }
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-medium transition"
          >
            Book Appointment
          </button>

          <button
            onClick={() => navigate("/doctors")}
            className="flex-1 border border-gray-300 hover:bg-gray-100 py-3 rounded-xl text-lg transition"
          >
            Back to Doctors
          </button>
        </div>
      </div>
    </div>
  );
};

export default Doctorsdetail;