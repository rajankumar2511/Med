import CircuitBreaker from "opossum";
import {
  sendConfirmationEmail,
  sendReminderEmail,
} from "../services/email.service.js";

const options = {
  timeout: 5000,
  errorThresholdPercentage: 50,
  resetTimeout: 10000,
  volumeThreshold: 5,
};

export const confirmationBreaker = new CircuitBreaker(
  sendConfirmationEmail,
  options
);

export const reminderBreaker = new CircuitBreaker(
  sendReminderEmail,
  options
);

// Confirmation events
// Confirmation events
confirmationBreaker.on("open", () => {
  console.log("🔴 Confirmation Transition: CLOSED → OPEN");
});

confirmationBreaker.on("halfOpen", () => {
  console.log("🟡 Confirmation Transition: OPEN → HALF-OPEN");
});

confirmationBreaker.on("close", () => {
  console.log("🟢 Confirmation Transition: HALF-OPEN → CLOSED");
});

confirmationBreaker.on("reject", () => {
  console.log("🚫 Confirmation Request Rejected (Circuit OPEN)");
});

// Reminder events
reminderBreaker.on("open", () => {
  console.log("🔴 Reminder Transition: CLOSED → OPEN");
});

reminderBreaker.on("halfOpen", () => {
  console.log("🟡 Reminder Transition: OPEN → HALF-OPEN");
});

reminderBreaker.on("close", () => {
  console.log("🟢 Reminder Transition: HALF-OPEN → CLOSED");
});

reminderBreaker.on("reject", () => {
  console.log("🚫 Reminder Request Rejected (Circuit OPEN)");
});

// Fallbacks
confirmationBreaker.fallback(() => {
  console.log("⚠ Confirmation email skipped (Circuit Open)");
  throw new Error("Confirmation Circuit OPEN");
});

reminderBreaker.fallback(() => {
  console.log("⚠ Reminder email skipped (Circuit Open)");
  throw new Error("Reminder Circuit OPEN");
});