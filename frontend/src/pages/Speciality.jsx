import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Stethoscope,
  HeartPulse,
  Eye,
  Baby,
  Brain,
  Activity,
  Bone,
  Ear,
  User,
  Syringe,
  Flame,
  Microscope,
  Scissors,
  Hospital,
  ShieldPlus,
  Droplets,
} from "lucide-react";


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
  { name: "Ophthalmologist", icon: <Eye />, color: "from-sky-200 to-sky-100" },

  { name: "Gastroenterologist", icon: <Activity />, color: "from-green-200 to-green-100" },
  { name: "Pulmonologist", icon: <Activity />, color: "from-emerald-200 to-emerald-100" },

  { name: "Nephrologist", icon: <Microscope />, color: "from-violet-200 to-violet-100" },
  { name: "Urologist", icon: <User />, color: "from-lime-200 to-lime-100" },

  { name: "Endocrinologist", icon: <Syringe />, color: "from-orange-200 to-orange-100" },

  { name: "Oncologist", icon: <Flame />, color: "from-rose-200 to-rose-100" },
  { name: "Hematologist", icon: <Droplets />, color: "from-fuchsia-200 to-fuchsia-100" },
  { name: "Rheumatologist", icon: <ShieldPlus />, color: "from-teal-200 to-teal-100" },

  { name: "Surgeon", icon: <Scissors />, color: "from-slate-200 to-slate-100" },
  { name: "Anesthesiologist", icon: <Hospital />, color: "from-neutral-200 to-neutral-100" },

  { name: "Radiologist", icon: <Microscope />, color: "from-zinc-200 to-zinc-100" },
  { name: "Pathologist", icon: <Microscope />, color: "from-stone-200 to-stone-100" },

  { name: "Infectious Disease Specialist", icon: <ShieldPlus />, color: "from-red-200 to-orange-200" },
  { name: "Allergist", icon: <ShieldPlus />, color: "from-amber-200 to-amber-100" },

  { name: "Plastic Surgeon", icon: <Scissors />, color: "from-pink-200 to-rose-200" },
  { name: "Vascular Surgeon", icon: <Activity />, color: "from-red-200 to-pink-200" },

  { name: "Geriatrician", icon: <User />, color: "from-blue-200 to-indigo-200" },
  { name: "Sports Medicine Specialist", icon: <Activity />, color: "from-lime-200 to-green-200" },
];

const Speciality = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredSpecialties = specialties.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleClick = (speciality) => {
    navigate(`/doctors/${encodeURIComponent(speciality)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-2">
          Medical Specialties
        </h1>
        <p className="text-gray-500 text-center mb-10">
          Choose a specialty to find the right doctor
        </p>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <input
            type="text"
            placeholder="Search specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {filteredSpecialties.map((specialty, index) => (
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
                className="w-20 h-20 mx-auto mb-5 bg-white/90 rounded-2xl
                flex items-center justify-center shadow-lg
                group-hover:scale-110 transition-all"
              >
                {React.cloneElement(specialty.icon, {
                  size: 32,
                  strokeWidth: 2,
                  className: "text-blue-700",
                })}
              </div>

              <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition">
                {specialty.name}
              </p>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSpecialties.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No specialties found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Speciality;
