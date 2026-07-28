import { Worker } from "bullmq";
import { bullmqConnection, dlqQueue } from "../config/bullmq.js";
import {
  confirmationBreaker,
  reminderBreaker,
} from "../lib/emailBreaker.js";

export const appointmentWorker = new Worker(
  "appointment-queue",
  async (job) => {
    console.log(`📥 Processing Job ${job.id}: ${job.name}`);

    switch (job.name) {
      case "send-confirmation-email":
        await confirmationBreaker.fire(job.data);
        break;

      case "send-reminder-email":
        await reminderBreaker.fire(job.data);
        break;

      default:
        throw new Error(`Unknown job: ${job.name}`);
    }
  },
  {
    connection: bullmqConnection,
  }
);

// Job started
appointmentWorker.on("active", (job) => {
  console.log(
    `🚀 Processing Job ${job.id} | Attempt ${
      job.attemptsMade + 1
    }/${job.opts.attempts}`
  );
});

// Job completed
appointmentWorker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed successfully`);
});

// Job failed
appointmentWorker.on("failed", async (job, err) => {
  console.log(
    `❌ Job ${job?.id} failed | Attempt ${job?.attemptsMade}/${job?.opts.attempts}`
  );
  console.error(err.message);

  // Retries exhausted → Move to DLQ
  if (job && job.attemptsMade === job.opts.attempts) {
    console.log("📦 Retries exhausted. Moving job to DLQ...");

    await dlqQueue.add("dead-letter", {
      originalJobId: job.id,
      originalQueue: job.queueName,
      jobName: job.name,
      jobData: job.data,
      error: err.message,
      failedAt: new Date().toISOString(),
    });

    console.log("✅ Job moved to DLQ");
  }
});

// Worker ready
appointmentWorker.on("ready", () => {
  console.log("🚀 Appointment Worker is ready");
});

// Worker error
appointmentWorker.on("error", (err) => {
  console.error("❌ Worker Error:", err);
});