import { Queue } from "bullmq";

export const bullmqConnection = {
  url: process.env.REDIS_URL,
};

export const appointmentQueue = new Queue("appointment-queue", {
  connection: bullmqConnection,
});

export const dlqQueue = new Queue("appointment-dlq", {
  connection: bullmqConnection,
});
