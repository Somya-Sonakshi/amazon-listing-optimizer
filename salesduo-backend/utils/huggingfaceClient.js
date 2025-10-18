import dotenv from "dotenv";
import { HfInference } from "@huggingface/inference";

dotenv.config();


const hf = new HfInference(process.env.HF_TOKEN);
const SYSTEM_PROMPT = `
You are an assistant that optimizes Amazon product listings.
You must always respond with **valid JSON only**, with no text, explanation, or markdown outside the JSON.

The JSON MUST strictly follow this structure:

{
  "title": "Optimized product title",
  "description": "Optimized product description",
  "bullets": ["Bullet 1", "Bullet 2", "Bullet 3"],
  "keywords": ["keyword1", "keyword2", "keyword3"]
}

Rules:
- Do not add any text before or after the JSON.
- Do not use Markdown formatting.
- Always include all four fields (title, description, bullets, keywords).
- "bullets" and "keywords" must be arrays.
- Ensure the JSON is valid and properly escaped.
`;


export async function optimizeText(prompt) {
  try {
    if (!process.env.HF_TOKEN) {
      console.error(" HF_TOKEN not found in environment variables");
      return null;
    }
    console.log("HF_TOKEN:", process.env.HF_TOKEN);
    console.log(" HF token loaded");
    console.log(" Sending prompt:", prompt);

    const response = await hf.chatCompletion({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      max_tokens: 1024,
    });

    const optimizedContent = response?.choices?.[0]?.message?.content;

    if (!optimizedContent) {
      console.warn(" No valid content returned:", response);
      return null;
    }

    console.log("Optimized Content:", optimizedContent);
    return JSON.parse(optimizedContent);
  } catch (err) {
    console.error("Error calling Hugging Face:", err.message);
    return null;
  }
}
