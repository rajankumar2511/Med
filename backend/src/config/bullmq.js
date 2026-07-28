import { Queue } from "bullmq";

export const bullmqConnection = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
};

export const appointmentQueue = new Queue("appointment-queue", {
  connection: bullmqConnection,
});

export const dlqQueue = new Queue("appointment-dlq", {
  connection: bullmqConnection,
});