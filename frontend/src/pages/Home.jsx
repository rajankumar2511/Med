import React from "react";
import headers from "../assets/header_img.png";
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
  Hospital
} from "lucide-react";

const Home = () => {
  const specialties = [
    { name: "General Physician", color: "bg-blue-100", icon: <Stethoscope /> },
    { name: "Gynecologist", color: "bg-pink-100", icon: <HeartPulse /> },
    { name: "Dermatologist", color: "bg-purple-100", icon: <Eye /> },
    { name: "Pediatrician", color: "bg-yellow-100", icon: <Baby /> },
    { name: "Neurologist", color: "bg-indigo-100", icon: <Brain /> },
    { name: "Gastroenterologist", color: "bg-green-100", icon: <Activity /> },
    { name: "Cardiologist", color: "bg-red-100", icon: <HeartPulse /> },
    { name: "Orthopedist", color: "bg-gray-200", icon: <Bone /> },
    { name: "Psychiatrist", color: "bg-teal-100", icon: <Brain /> },
    { name: "ENT Specialist", color: "bg-cyan-100", icon: <Ear /> },
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
              Book Appointment
              <span className="block text-blue-600 mt-2">
                With Trusted Doctors
              </span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl">
              Browse verified doctors, compare specialties, and book
              appointments easily — healthcare made simple.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium shadow-lg transition-all">
                Find a Doctor
              </button>
              <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full font-medium transition-all">
                Learn More
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
                  <Hospital size={26} className="text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">24/7 Support</p>
                  <p className="text-sm text-gray-600">We’re always here</p>
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
            <span className="font-semibold">Find by Specialty</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">
            Expert Care for{" "}
            <span className="text-blue-600">Every Need</span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from top-rated specialists across multiple medical fields.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {specialties.map((specialty, index) => (
            <div
              key={index}
              className={`${specialty.color} bg-gradient-to-br from-white/40 to-transparent
              rounded-2xl p-7 text-center cursor-pointer
              border border-white hover:border-blue-200
              shadow-md hover:shadow-2xl
              transition-all duration-300
              transform hover:-translate-y-2 group`}
            >
              <div className="w-20 h-20 mx-auto mb-5 bg-white rounded-2xl
                flex items-center justify-center shadow-lg
                group-hover:scale-110 transition-all">
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
          <button className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700">
            View all specialties
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* FINAL CTA */}
      <footer className="mt-20">

        {/* ===== CTA SECTION ===== */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-600">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 rounded-full border-2 border-white/30"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full border-2 border-white/20"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full border border-white/15"></div>
          </div>

          <div className="container relative mx-auto px-4 py-24 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              <span className="text-white/90 text-sm font-medium">Trusted Healthcare Platform</span>
            </div>

            <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Your Health Journey
              <span className="block text-white/90 text-2xl md:text-3xl font-normal mt-2">
                Starts Here
              </span>
            </h3>

            <p className="text-blue-100/90 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              Connect with expert doctors, schedule appointments seamlessly, and prioritize your wellness today.
            </p>

            <button
              className="group relative bg-white text-blue-700 px-12 py-5 rounded-full
                 text-lg font-semibold shadow-2xl
                 hover:shadow-3xl hover:scale-[1.02]
                 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/30 to-transparent 
                      -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative flex items-center justify-center gap-3">
                Book Appointment Now
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </span>
            </button>

            <p className="text-white/70 text-sm mt-8 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              HIPAA Compliant • 100% Secure • Verified Doctors
            </p>
          </div>
        </div>

        {/* ===== MAIN FOOTER ===== */}
        <div className="relative bg-gradient-to-b from-sky-50 to-white">
          {/* Subtle pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_0.5px,transparent_0.5px)] bg-[length:20px_20px] opacity-[0.02]"></div>

          <div className="container relative mx-auto px-4 py-20">

            {/* Bottom Bar */}
            <div className="relative mt-16 pt-12 border-t border-blue-100/40
                      flex flex-col sm:flex-row
                      justify-between items-center gap-8
                      text-gray-700">

              {/* Copyright */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 
                        flex items-center justify-center border border-blue-100/50">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 tracking-tight">
                    © {new Date().getFullYear()} MediSlot
                  </p>
                  <p className="text-gray-500/80 text-sm">
                    All rights reserved
                  </p>
                </div>
              </div>

              {/* Links */}
              <div className="flex items-center gap-8">
                <span className="relative group">
                  <span className="text-gray-600/90 hover:text-blue-700 
                           cursor-pointer font-medium transition-colors duration-200
                           px-1 py-0.5">
                    Privacy Policy
                  </span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 
                           group-hover:w-full transition-all duration-300 rounded-full"></span>
                </span>

                <div className="w-px h-4 bg-gradient-to-b from-transparent via-blue-200 to-transparent"></div>

                <span className="relative group">
                  <span className="text-gray-600/90 hover:text-blue-700 
                           cursor-pointer font-medium transition-colors duration-200
                           px-1 py-0.5">
                    Terms of Service
                  </span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 
                           group-hover:w-full transition-all duration-300 rounded-full"></span>
                </span>
              </div>
            </div>

          </div>
        </div>
      </footer>



    </div>
  );
};

export default Home;
