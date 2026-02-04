import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { docdata } from "../lib/api.js";
import { useDoctors } from "../context/DoctorContext";

const Doctors = () => {
  const { doctors, setDoctors, loaded, setLoaded } = useDoctors();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      if (loaded) return; // ✅ prevent refetch

      const data = await docdata();
      setDoctors(data.doctors);
      setLoaded(true);
    };

    fetchDoctors();
  }, [loaded, setDoctors, setLoaded]);

  if (!loaded) {
    return <p className="text-center mt-10">Loading doctors...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Available Doctors
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {doctors.map((doctor) => (
          <div
            key={doctor._id}
            className="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold">{doctor.name}</h2>
              <p className="text-sm text-gray-500">
                {doctor.specialization}
              </p>

              <p className="mt-2 text-sm">
                Experience: {doctor.experience} years
              </p>

              <p className="text-sm">
                Fee:{" "}
                <span className="font-semibold text-green-600">
                  ₹{doctor.consultationFee}
                </span>
              </p>
            </div>

            <button
              onClick={() => navigate(`/doctor/${doctor._id}`)}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
            >
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Doctors;
