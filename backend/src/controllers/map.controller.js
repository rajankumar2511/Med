import prisma from "../lib/prisma.js";

// Helper function to calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const getNearbyDoctors = async (req, res) => {
  try {
    const { lng, lat } = req.body;

    console.log("lat:", lat, "lng:", lng);

    // Validate input
    if (lat == null || lng == null) {
      return res.status(400).json({
        success: false,
        message: "lat and lng are required",
      });
    }

    // Fetch all active doctors with their user info
    const allDoctors = await prisma.doctor.findMany({
      where: {
        isActive: true,
      },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    });

    // Calculate distance and filter
    const doctorsWithDistance = allDoctors.map((doctor) => {
      const distance = calculateDistance(lat, lng, doctor.latitude, doctor.longitude);
      return {
        ...doctor,
        distance,
      };
    });

    // Filter doctors within 25km
    const nearbyDoctors = doctorsWithDistance.filter((doc) => doc.distance <= 25);

    // Sort by distance (nearest first)
    nearbyDoctors.sort((a, b) => a.distance - b.distance);

    res.json({
      success: true,
      count: nearbyDoctors.length,
      doctors: nearbyDoctors,
    });
  } catch (err) {
    console.error("Nearby doctor error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch nearby doctors",
    });
  }
};

