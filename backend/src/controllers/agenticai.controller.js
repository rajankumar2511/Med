import { callLLM } from "../services/llm.service.js";

const ALLOWED_SPECIALTIES = [
  "General Physician",
  "Cardiologist",
  "Dermatologist",
  "Pediatrician",
  "Gynecologist",
  "Neurologist",
  "Psychiatrist",
  "Orthopedist",
  "ENT Specialist",
  "Ophthalmologist",
  "Gastroenterologist",
  "Pulmonologist",
  "Nephrologist",
  "Urologist",
  "Endocrinologist",
  "Oncologist",
  "Hematologist",
  "Rheumatologist",
  "Surgeon",
  "Anesthesiologist",
  "Radiologist",
  "Pathologist",
  "Infectious Disease Specialist",
  "Allergist",
  "Plastic Surgeon",
  "Vascular Surgeon",
  "Geriatrician",
  "Sports Medicine Specialist"
];

export const doctorFinderAgent = async (req, res) => {
   console.log("Received body:", req.body);
 try {
    const { symptoms } = req.body;

    if (!symptoms || typeof symptoms !== "string" || symptoms.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Please describe your symptoms clearly."
      });
    }

    const systemPrompt = `
You are a healthcare routing assistant.

TASK:
Choose the SINGLE most relevant medical specialty.

ALLOWED SPECIALTIES:
${ALLOWED_SPECIALTIES.join(" | ")}

STRICT RULES:
- Choose ONLY from the list above
- Do NOT diagnose
- Do NOT give medical advice
- Do NOT invent specialties
- Do NOT change spelling
- Output ONLY valid JSON

JSON FORMAT:
{
  "specialty": "<exact specialty from list>",
  "reason": "short, simple explanation"
}
`;

    const aiResult = await callLLM({
      systemPrompt,
      userPrompt: `Patient symptoms: "${symptoms}"`
    });

    // Absolute safety fallback
    if (!ALLOWED_SPECIALTIES.includes(aiResult.specialty)) {
      aiResult.specialty = "General Physician";
      aiResult.reason = "Symptoms are broad and require an initial general consultation.";
    }

    res.json({
      success: true,
      data: aiResult
    });

  } catch (error) {
    console.error("AI Agent Error:", error);

    res.status(500).json({
      success: false,
      message: "AI assistant is temporarily unavailable."
    });
  }
};
