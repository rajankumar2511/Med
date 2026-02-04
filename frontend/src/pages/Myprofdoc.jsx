import { useState } from "react";
import { docupprof } from "../api/api";

const MyProfDoc = () => {
  const [formData, setFormData] = useState({
    specialization: "",
    experience: "",
    hospital: "",
    qualification: "",
    phone: "",
    consultationFee: "",
    profileImage: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault(); // 🔥 REQUIRED

  try {
    await docupprof(formData);
    alert("Profile saved successfully");
  } catch {
    alert("Failed to save profile");
  }
};



  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Update Doctor Profile
        </h2>

        {/* Name */}
       

        {/* Specialization */}
        <input
          type="text"
          name="specialization"
          placeholder="Specialization"
          value={formData.specialization}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        {/* Experience */}
        <input
          type="number"
          name="experience"
          placeholder="Years of Experience"
          value={formData.experience}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        {/* Hospital */}
        <input
          type="text"
          name="hospital"
          placeholder="Hospital / Clinic"
          value={formData.hospital}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />

        {/* Qualification */}
        <input
          type="text"
          name="qualification"
          placeholder="Qualification"
          value={formData.qualification}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />

        {/* Phone */}
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />

        {/* Consultation Fee */}
        <input
          type="number"
          name="consultationFee"
          placeholder="Consultation Fee"
          value={formData.consultationFee}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />

        {/* Profile Image URL */}
        <input
          type="text"
          name="profileImage"
          placeholder="Profile Image URL"
          value={formData.profileImage}
          onChange={handleChange}
          className="w-full mb-6 p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default MyProfDoc;
