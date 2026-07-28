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

export const addMedicalStore = async (req, res) => {
  try {
    const {
      name,
      ownerName,
      licenseNumber,
      phone,
      email,
      location,
    } = req.body;

    if (
      !name ||
      !ownerName ||
      !licenseNumber ||
      !phone ||
      !location ||
      !location.coordinates ||
      !location.address
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    if (location.coordinates.length !== 2) {
      return res.status(400).json({
        success: false,
        message: "Coordinates must be [longitude, latitude]",
      });
    }

    const existing = await prisma.medicalStore.findUnique({
      where: { licenseNumber },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Store already exists with this license",
      });
    }

    const newStore = await prisma.medicalStore.create({
      data: {
        name,
        ownerName,
        licenseNumber,
        phone,
        email,
        latitude: location.coordinates[1],
        longitude: location.coordinates[0],
        address: location.address,
        placeId: location.placeId || null,
        city: location.city || null,
        state: location.state || null,
      },
    });

    res.status(201).json({
      success: true,
      message: "Medical store added successfully",
      data: newStore,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getNearbyMedicalStores = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 25 } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and Longitude are required",
      });
    }

    // Fetch all stores and filter by distance
    const allStores = await prisma.medicalStore.findMany();

    const nearbyStores = allStores.filter((store) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        store.latitude,
        store.longitude
      );
      return distance <= maxDistance;
    });

    // Sort by distance
    nearbyStores.sort((a, b) => {
      const distA = calculateDistance(latitude, longitude, a.latitude, a.longitude);
      const distB = calculateDistance(latitude, longitude, b.latitude, b.longitude);
      return distA - distB;
    });

    res.status(200).json({
      success: true,
      count: nearbyStores.length,
      data: nearbyStores,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

