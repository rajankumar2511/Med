import { Worker } from "bullmq";
import { bullmqConnection } from "../config/bullmq.js";
import prisma from "../lib/prisma.js";

export const dlqWorker = new Worker(
  "appointment-dlq",
  async (job) => {
    try {
      console.log(`🚨 Processing DLQ Job: ${job.id}`);

      await prisma.failedJob.create({
        data: {
          jobId: String(job.data.jobId ?? job.id),
          queueName: job.data.queueName ?? "appointment-email",
          jobName: job.name,
          payload: job.data,
          failedReason: job.data.failedReason ?? "Unknown Error",
        },
      });

      console.log(`✅ Failed Job ${job.id} saved to database.`);
    } catch (error) {
      console.error("❌ Failed to save DLQ job:", error);
      throw error;
    }
  },
  {
    connection: bullmqConnection,
  }
);

// Worker Events
dlqWorker.on("ready", () => {
  console.log("🚨 DLQ Worker Ready");
});

dlqWorker.on("completed", (job) => {
  console.log(`✅ DLQ Job ${job.id} processed successfully.`);
});

dlqWorker.on("failed", (job, err) => {
  console.error(`❌ DLQ Job ${job?.id} failed.`);
  console.error(err.message);
});

dlqWorker.on("error", (err) => {
  console.error("❌ DLQ Worker Error:", err);
});