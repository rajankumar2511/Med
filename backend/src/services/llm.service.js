import { CohereClient } from "cohere-ai";

export async function callLLM({ systemPrompt, userPrompt }) {
  if (!process.env.COHERE_API_KEY) {
    throw new Error("COHERE_API_KEY is missing");
  }

  const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
  });

  const response = await cohere.chat({
    temperature: 0.2,
    message: userPrompt,
    chatHistory: [
      {
        role: "SYSTEM",
        message: systemPrompt,
      },
      {
  role: "SYSTEM",
  message: `
You are a JSON-only API.
- Do NOT include explanations
- Do NOT include markdown
- Do NOT include text before or after JSON
- Output ONLY raw JSON
If you violate this, the response is invalid.
`,
}

    ],
  });

  const text = response.text.trim();

  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error("LLM returned invalid JSON");
  }
}
