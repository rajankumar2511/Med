import prisma from "../../lib/prisma.js";

export const executeGetMyAppointments = async (req) => {
  const patientId = req.user.id;

  const appointments = await prisma.appointment.findMany({
    where: {
      patientId,
      status: {
        notIn: ["cancelled", "no_show"],
      },
    },
    include: {
      doctor: {
        include: {
          user: {
            select: {
              fullName: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: [
      { date: "asc" },
      { hour: "asc" },
    ],
  });

  return {
    success: true,
    count: appointments.length,
    appointments,
  };
};