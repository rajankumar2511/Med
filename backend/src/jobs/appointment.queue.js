import { appointmentQueue } from "../config/bullmq.js";

export const addConfirmationEmailJob = async (jobData) => {
  await appointmentQueue.add(
    "send-confirmation-email",
    jobData,
    {
      attempts: 5,

      backoff: {
        type: "exponential",
        delay: 2000,
      },

      removeOnComplete: 100,

      removeOnFail: false,
    }
  );
};



export const addReminderEmailJob = async (jobData, delay) => {
  await appointmentQueue.add(
    "send-reminder-email",
    jobData,
    {
      delay,

      attempts: 5,

      backoff: {
        type: "exponential",
        delay: 2000,
      },

      removeOnComplete: 100,
      removeOnFail: false,
    }
  );
};