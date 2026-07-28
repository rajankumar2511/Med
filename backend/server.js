import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";

import { redis } from "./src/lib/redis.js"; // ✅ Add this
import "./src/workers/appointment.worker.js";
import "./src/workers/dlq.worker.js";
import { warmDoctorsCache } from "./src/utils/cacheWarmer.js";
import { processOutboxEvents } from "./src/workers/outbox.worker.js";

import authRoutes from "./src/routes/auth.route.js";
import appointmentRoutes from "./src/routes/appointment.routes.js";
import paymentRoutes from "./src/routes/payment.routes.js";
import docroutes from "./src/routes/doctor.route.js";
import agentai from "./src/routes/agenticai.js";
import map from "./src/routes/map.route.js";
import medical from "./src/routes/medicalstore.route.js";
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/doctor", docroutes);
app.use("/api/ai", agentai);
app.use("/api/map", map);
app.use("/api/medical", medical);

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

try {
  await redis.connect();
  console.log("✅ Redis connected");
  await warmDoctorsCache();
  processOutboxEvents();

  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);

  });

} catch (err) {
  console.log("❌ Failed to connect to Redis:", err);
  process.exit(1);
}