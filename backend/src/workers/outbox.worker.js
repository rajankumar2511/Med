import prisma from "../lib/prisma.js";

import {
  addConfirmationEmailJob,
  addReminderEmailJob,
} from "../jobs/appointment.queue.js";

export function processOutboxEvents() {
  console.log("📦 Outbox Worker Started");

  setInterval(async () => {
    try {
      const events = await prisma.outboxEvent.findMany({
        where: {
          processed: false,
        },
        orderBy: {
          createdAt: "asc",
        },
        take: 10,
      });

      for (const event of events) {
        try {
          if (event.eventType === "APPOINTMENT_BOOKED") {
            const payload = event.payload;

            // Publish confirmation email job
            await addConfirmationEmailJob({
              appointmentId: payload.appointmentId,

              patientEmail: payload.patientEmail,
              patientName: payload.patientName,

              doctorEmail: payload.doctorEmail,
              doctorName: payload.doctorName,

              appointmentDate: payload.appointmentDate,
              appointmentHour: payload.appointmentHour,
              tokenNumber: payload.tokenNumber,
            });

            // Calculate reminder delay
            const appointmentDateTime = new Date(payload.appointmentDate);

            appointmentDateTime.setHours(
              payload.appointmentHour,
              0,
              0,
              0
            );

            const reminderTime = new Date(appointmentDateTime);
            reminderTime.setHours(reminderTime.getHours() - 1);

            // Replace this with your original delay calculation if needed
            const delay = 10000;

            if (delay > 0) {
              await addReminderEmailJob(
                {
                  appointmentId: payload.appointmentId,
                  patientEmail: payload.patientEmail,
                  patientName: payload.patientName,
                  doctorName: payload.doctorName,
                  appointmentDate: payload.appointmentDate,
                  appointmentHour: payload.appointmentHour,
                  tokenNumber: payload.tokenNumber,
                },
                delay
              );
            }

            console.log("📤 Published event to BullMQ");

            // Mark event as processed ONLY after successful publishing
            await prisma.outboxEvent.update({
              where: {
                id: event.id,
              },
              data: {
                processed: true,
                processedAt: new Date(),
              },
            });

            console.log(`✅ Outbox Event ${event.id} processed`);
          }
        } catch (err) {
          console.error(
            `❌ Failed processing Outbox Event ${event.id}`,
            err
          );
        }
      }
    } catch (error) {
      console.error("❌ Outbox Worker Error:", error);
    }
  }, 2000);
}