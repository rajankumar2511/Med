import React, { useEffect, useState } from "react";
import { getmsdata } from "../api/api";
import { useNavigate } from "react-router-dom";

const Medicalstore = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

useEffect(() => {
  const fetchStores = async () => {
    try {
      const storedLocation = sessionStorage.getItem("userLocation");

      if (!storedLocation) {
        console.log("Location not found yet");
        return;
      }

      const location = JSON.parse(storedLocation);

      const data = await getmsdata(
        location.longitude,
        location.latitude
      );

      setStores(data.data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchStores();
}, []);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">
          Loading nearby medical stores...
        </p>
      </div>
    );
  }
  if (!sessionStorage.getItem("userLocation")) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 text-lg">
        Detecting your location...
      </p>
    </div>
  );
}


  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          Nearby Medical Stores
        </h1>

        {stores.length === 0 ? (
          <p className="text-gray-500">
            No medical stores found within 25km.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <div
                key={store._id}
                className="bg-white rounded-2xl shadow-md p-6 transition hover:shadow-lg"
              >
                {/* Store Name */}
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold">
                    {store.name}
                  </h2>

                  {store.is_verified && (
                    <span className="text-green-600 text-xs font-medium">
                      ✓ Verified
                    </span>
                  )}
                </div>

                {/* Address */}
                <p className="text-gray-500 text-sm mt-2">
                  {store.location?.address}
                </p>

                {/* Rating */}
                <p className="mt-3 text-sm">
                  ⭐ {store.rating?.toFixed(1) || "0.0"}
                </p>

                {/* Contact */}
                <p className="text-sm text-gray-600 mt-2">
                  📞 {store.phone}
                </p>

                {/* Action */}
                <button
                  onClick={() =>
                    navigate(`/medical-store/${store._id}`)
                  }
                  className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition"
                >
                  View Store
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Medicalstore;
