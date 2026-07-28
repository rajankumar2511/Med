import dotenv from "dotenv";
import { CohereClient } from "cohere-ai";

dotenv.config();

if (!process.env.COHERE_API_KEY) {
  throw new Error("COHERE_API_KEY missing");
}

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

// 🚀 DO NOT PASS model
const res = await cohere.chat({
  temperature: 0,
  message: 'Reply ONLY in JSON: {"status":"ok"}',
});

console.log(res.text);
