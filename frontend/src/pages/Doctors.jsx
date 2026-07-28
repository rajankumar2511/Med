import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { docdata, agentAIDoctorFinder, nearbydoc } from "../lib/api.js";
import { useDoctors } from "../context/DoctorContext";

const Doctors = () => {
  const { doctors, setDoctors, loaded, setLoaded } = useDoctors();
  const { speciality } = useParams();
  const navigate = useNavigate();

  // ================================
  // 🔹 AI FEATURE STATE
  // ================================
  const [symptoms, setSymptoms] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  // ================================
  // 🔹 LOCATION STATE
  // ================================
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  // ================================
  // 🔹 DISTANCE DOCTORS STATE
  // ================================
  const [doctorsDistance, setDoctorsDistance] = useState([]);
  const [distanceLoading, setDistanceLoading] = useState(false);
  const [distanceError, setDistanceError] = useState("");

  // ================================
  // 🔹 AI DOCTOR FINDER
  // ================================
  const handleFindDoctor = async () => {
    if (!symptoms.trim()) {
      setAiError("Please describe your symptoms.");
      return;
    }

    setAiLoading(true);
    setAiError("");

    try {
      const res = await agentAIDoctorFinder(symptoms);

      if (!res.success) {
        throw new Error("AI failed to decide");
      }

      const specialityFromAI = res.data.specialty
        .trim()

      navigate(`/doctors/${specialityFromAI}`);
    } catch (err) {
      setAiError("Could not find a doctor right now. Try again.");
    } finally {
      setAiLoading(false);
    }
  };

  // ================================
  // 🔹 RESET TO /all ON REFRESH
  // ================================
  useEffect(() => {
    if (!speciality) return;

    if (speciality !== "all") {
      navigate("/doctors/all", { replace: true });
    }
  }, []);

  // ================================
  // 🔹 FETCH ALL DOCTORS (CONTEXT)
  // ================================
  useEffect(() => {
    const fetchDoctors = async () => {
      if (loaded) return;

      const data = await docdata();
      setDoctors(data.doctors);
      setLoaded(true);
    };

    fetchDoctors();
  }, [loaded, setDoctors, setLoaded]);

  // ================================
  // 🔹 GET USER LOCATION
  // ================================

useEffect(() => {
  const fetchNearbyDoctors = async () => {
    try {
      const storedLocation = sessionStorage.getItem("userLocation");

      if (!storedLocation) {
        setDistanceError("Location not available.");
        return;
      }

      const { longitude, latitude } = JSON.parse(storedLocation);

      setDistanceLoading(true);
      setDistanceError("");

      const data = await nearbydoc({
        longitude,
        latitude,
      });

      setDoctorsDistance(data.doctors);

    } catch (err) {
      setDistanceError("Failed to fetch nearby doctors.");
    } finally {
      setDistanceLoading(false);
    }
  };

  fetchNearbyDoctors();
}, []);

  // ================================
  // 🔹 FILTER BY SPECIALITY
  // ================================
  const filteredDoctors = useMemo(() => {
    if (speciality === "all") return doctors;

    return doctors.filter((doc) =>
      doc.specialization.toLowerCase().includes(speciality.toLowerCase())
    );
  }, [doctors, speciality]);

  const distanceMap = useMemo(() => {
    const map = {};
    doctorsDistance.forEach((doc) => {
      map[doc._id.toString()] = doc.distance;
    });
    return map;
  }, [doctorsDistance]);


  if (!loaded) {
    return <p className="text-center mt-10">Loading doctors...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        {speciality === "all"
          ? "Available Doctors"
          : `${speciality} Doctors`}
      </h1>

      {/* ================= AI SECTION ================= */}
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 mb-10">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Describe Your Symptoms
        </h2>

        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          rows={4}
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. chest pain, dizziness..."
        />

        {aiError && (
          <p className="text-red-500 text-sm mt-2">{aiError}</p>
        )}

        <button
          onClick={handleFindDoctor}
          disabled={aiLoading}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg disabled:opacity-50"
        >
          {aiLoading ? "Analyzing symptoms..." : "Find Doctor Using AI"}
        </button>
      </div>

      {/* ================= LOCATION STATUS ================= */}
      {locationLoading && (
        <p className="text-center text-gray-600">
          Detecting your location...
        </p>
      )}
      {locationError && (
        <p className="text-center text-red-500">
          {locationError}
        </p>
      )}

      {/* ================= DOCTORS GRID ================= */}
      {filteredDoctors.length === 0 ? (
        <p className="text-center text-gray-500">
          No doctors found.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold">
                  {doctor.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {doctor.specialization}
                </p>

                <p className="mt-2 text-sm">
                  Experience: {doctor.experience} years
                </p>

                <div className="flex justify-between items-center mt-2">
                  {/* Fee */}
                  <p className="font-bold text-green-600">
                    ₹{doctor.consultationFee}
                  </p>

                  {/* Distance */}
                  {distanceMap[doctor._id?.toString()] !== undefined && (
                    <p className="font-bold text-blue-600">
                      {distanceMap[doctor._id.toString()].toFixed(2)} km
                    </p>
                  )}

                </div>

              </div>

              <button
                onClick={() => navigate(`/doctor/${doctor._id}`)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Doctors;
