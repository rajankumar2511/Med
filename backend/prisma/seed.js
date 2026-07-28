import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("123456", 10);

  const doctors = [
    {
      name: "Dr. Raj Sharma",
      email: "raj.sharma@gmail.com",
      specialization: "Cardiologist",
      experience: 12,
      hospital: "Apollo Hospital",
      city: "Delhi",
      state: "Delhi",
      lat: 28.6139,
      lng: 77.2090,
    },
    {
      name: "Dr. Priya Verma",
      email: "priya.verma@gmail.com",
      specialization: "Dermatologist",
      experience: 8,
      hospital: "Fortis Hospital",
      city: "Chandigarh",
      state: "Chandigarh",
      lat: 30.7333,
      lng: 76.7794,
    },
    {
      name: "Dr. Aman Singh",
      email: "aman.singh@gmail.com",
      specialization: "Neurologist",
      experience: 15,
      hospital: "AIIMS",
      city: "Delhi",
      state: "Delhi",
      lat: 28.6200,
      lng: 77.2100,
    },
    {
      name: "Dr. Neha Kapoor",
      email: "neha.kapoor@gmail.com",
      specialization: "Orthopedic",
      experience: 10,
      hospital: "Max Hospital",
      city: "Ludhiana",
      state: "Punjab",
      lat: 30.9009,
      lng: 75.8573,
    },
    {
      name: "Dr. Karan Malhotra",
      email: "karan@gmail.com",
      specialization: "Dentist",
      experience: 7,
      hospital: "Paras Hospital",
      city: "Jalandhar",
      state: "Punjab",
      lat: 31.3260,
      lng: 75.5762,
    },
    {
      name: "Dr. Meera Gupta",
      email: "meera@gmail.com",
      specialization: "Gynecologist",
      experience: 11,
      hospital: "Apollo Hospital",
      city: "Delhi",
      state: "Delhi",
      lat: 28.6120,
      lng: 77.2200,
    },
    {
      name: "Dr. Rahul Bansal",
      email: "rahul@gmail.com",
      specialization: "Pediatrician",
      experience: 9,
      hospital: "Fortis Hospital",
      city: "Chandigarh",
      state: "Chandigarh",
      lat: 30.7340,
      lng: 76.7810,
    },
    {
      name: "Dr. Simran Kaur",
      email: "simran@gmail.com",
      specialization: "ENT Specialist",
      experience: 14,
      hospital: "AIIMS",
      city: "Delhi",
      state: "Delhi",
      lat: 28.6180,
      lng: 77.2050,
    },
    {
      name: "Dr. Vivek Arora",
      email: "vivek@gmail.com",
      specialization: "Psychiatrist",
      experience: 13,
      hospital: "Max Hospital",
      city: "Ludhiana",
      state: "Punjab",
      lat: 30.9020,
      lng: 75.8600,
    },
    {
      name: "Dr. Anjali Mehta",
      email: "anjali@gmail.com",
      specialization: "Ophthalmologist",
      experience: 6,
      hospital: "Apollo Hospital",
      city: "Jalandhar",
      state: "Punjab",
      lat: 31.3280,
      lng: 75.5790,
    },
  ];

  for (const d of doctors) {
    const user = await prisma.user.create({
      data: {
        fullName: d.name,
        email: d.email,
        password,
        role: "doctor",
        profilePic: "https://i.pravatar.cc/300",
        location: d.city,
        isOnboarded: true,
        isBlocked: false,
      },
    });

    await prisma.doctor.create({
      data: {
        userId: user.id,
        specialization: d.specialization,
        experience: d.experience,
        hospital: d.hospital,
        qualification: "MBBS, MD",
        phone: "9876543210",
        consultationFee: 800,
        workingDays: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        workingStart: 9,
        workingEnd: 17,
        appointmentsPerHour: 6,
        latitude: d.lat,
        longitude: d.lng,
        address: `${d.hospital}, ${d.city}`,
        city: d.city,
        state: d.state,
        placeId: null,
        profileImage: "https://i.pravatar.cc/400",
        rating: 4.7,
        totalReviews: 150,
        isVerified: true,
        isActive: true,
      },
    });
  }

  console.log("✅ 10 doctors inserted successfully!");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });