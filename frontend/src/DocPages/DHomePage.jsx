import React from "react";
import headers from "../assets/header_img.png";
import { useNavigate } from "react-router-dom";

import {
  Sparkles,
  ArrowRight,
  Stethoscope,
  HeartPulse,
  Baby,
  Brain,
  Bone,
  Ear,
  Eye,
  Activity,
  Hospital,
  User,
  CalendarDays,
  Clock,
  Users,
  FileText
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const handleClick = (speciality) => {
    navigate(`/doctors/${speciality}`);
  };
  
  const goToSpeciality = () => {
    navigate("/speciality");
  };

  const goToMyAppointments = () => {
    navigate("/my-appointments");
  };

  const specialties = [
    { name: "General Physician", icon: <Stethoscope />, color: "from-blue-200 to-blue-100" },
    { name: "Cardiologist", icon: <HeartPulse />, color: "from-red-200 to-red-100" },
    { name: "Dermatologist", icon: <Eye />, color: "from-purple-200 to-purple-100" },
    { name: "Pediatrician", icon: <Baby />, color: "from-yellow-200 to-yellow-100" },
    { name: "Gynecologist", icon: <User />, color: "from-pink-200 to-pink-100" },
    { name: "Neurologist", icon: <Brain />, color: "from-indigo-200 to-indigo-100" },
    { name: "Psychiatrist", icon: <Brain />, color: "from-teal-200 to-teal-100" },
    { name: "Orthopedist", icon: <Bone />, color: "from-amber-200 to-amber-100" },
    { name: "ENT Specialist", icon: <Ear />, color: "from-cyan-200 to-cyan-100" },
    { name: "Gastroenterologist", icon: <Activity />, color: "from-green-200 to-green-100" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* HERO */}
      <div className="container mx-auto px-4 py-14 md:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left */}
          <div className="lg:w-1/2 relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-200 rounded-full opacity-40" />
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-green-200 rounded-full opacity-40" />

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight mb-6 relative">
              Welcome Doctors
              <span className="block text-blue-600 mt-2">
                Manage Your Practice
              </span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl">
              Access patient records, manage appointments, and provide quality care — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={goToMyAppointments}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium shadow-lg transition-all flex items-center gap-2"
              >
                <CalendarDays size={18} />
                My Appointments
              </button>
              <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full font-medium transition-all flex items-center gap-2">
                <Clock size={18} />
                Today's Schedule
              </button>
            </div>
          </div>

          {/* Right */}
          <div className="lg:w-1/2 relative">
            <img
              src={headers}
              alt="Doctors"
              className="rounded-3xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Users size={26} className="text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">Active Patients</p>
                  <p className="text-sm text-gray-600">Manage your caseload</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SPECIALTIES */}
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-5 py-2.5 rounded-full mb-5">
            <Sparkles size={18} />
            <span className="font-semibold">Medical Specialties</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">
            Expert Care for{" "}
            <span className="text-blue-600">Every Need</span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse specialists across multiple medical fields and refer patients seamlessly.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {specialties.map((specialty, index) => (
            <div
              key={index}
              onClick={() => handleClick(specialty.name)}
              className={`bg-gradient-to-br ${specialty.color}
                rounded-2xl p-7 text-center cursor-pointer
                border border-white/60 hover:border-blue-200
                shadow-md hover:shadow-2xl
                transition-all duration-300
                hover:-translate-y-2 group`}
            >
              <div
                className="w-20 h-20 mx-auto mb-5 bg-white rounded-2xl
                  flex items-center justify-center shadow-lg
                  group-hover:scale-110 transition-all"
              >
                {React.cloneElement(specialty.icon, {
                  size: 32,
                  strokeWidth: 2,
                  className: "text-blue-700",
                })}
              </div>

              <p className="font-semibold text-gray-800 group-hover:text-blue-600">
                {specialty.name}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button
            onClick={goToSpeciality}
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700"
          >
            View all specialties
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* FINAL CTA */}
      <footer className="mt-14">
        {/* ===== CTA SECTION ===== */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-600 rounded-2xl mx-4">
          {/* Soft background accents */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-8 left-8 w-16 h-16 rounded-full border border-white/30" />
            <div className="absolute bottom-8 right-8 w-24 h-24 rounded-full border border-white/20" />
          </div>

          <div className="relative mx-auto max-w-5xl px-6 py-16 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1.5 rounded-full mb-5">
              <FileText className="w-4 h-4 text-white" />
              <span className="text-white/90 text-sm font-medium">
                Doctor Dashboard
              </span>
            </div>

            <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Streamline Your Practice
              <span className="block text-white/90 text-xl md:text-2xl font-normal mt-1">
                Focus on Patient Care
              </span>
            </h3>

            <p className="text-blue-100/90 text-base md:text-lg max-w-xl mx-auto mt-4 mb-8">
              Access patient history, manage schedules, and collaborate with colleagues.
            </p>

            <button
              onClick={goToMyAppointments}
              className="group relative inline-flex items-center gap-2
                bg-white text-blue-700 px-8 py-4 rounded-full
                font-semibold shadow-lg hover:scale-[1.03]
                transition-all duration-300 overflow-hidden"
            >
              <span
                className="absolute inset-0 bg-gradient-to-r
                  from-transparent via-blue-50/40 to-transparent
                  -translate-x-full group-hover:translate-x-full
                  transition-transform duration-700"
              />
              <span className="relative flex items-center gap-3">
                <CalendarDays size={18} />
                View Appointments
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </span>
            </button>

            <p className="text-white/70 text-xs mt-6 flex justify-center items-center gap-2">
              ✓ HIPAA Compliant • Secure • Patient-Centered Care
            </p>
          </div>
        </div>

        {/* ===== MAIN FOOTER ===== */}
        <div className="relative mt-10 bg-white">
          <div className="max-w-6xl mx-auto px-6 py-14">
            {/* Bottom Bar */}
            <div className="pt-8 border-t border-blue-100/40
              flex flex-col sm:flex-row items-center justify-between gap-6">
              
              {/* Brand */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Stethoscope className="w-4 h-4 text-blue-600" />
                </div>

                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    © {new Date().getFullYear()} MediSlot
                  </p>
                  <p className="text-gray-500 text-xs">
                    Doctor Portal
                  </p>
                </div>
              </div>

              {/* Links */}
              <div className="flex items-center gap-6 text-sm font-medium">
                {["Privacy Policy", "Terms of Service"].map((item) => (
                  <span key={item} className="relative group cursor-pointer text-gray-600 hover:text-blue-700">
                    {item}
                    <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-blue-500 group-hover:w-full transition-all duration-300 rounded-full" />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;