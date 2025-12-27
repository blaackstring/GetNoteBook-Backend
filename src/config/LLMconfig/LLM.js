import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const dirname = path.dirname(fileURLToPath(import.meta.url));
console.log(dirname);

dotenv.config({ path: path.resolve(dirname, '../../.env') });
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

console.log("GOOGLE_API_KEY:", process.env.GOOGLE_API_KEY);

export const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite", // Much faster than 2.5-pro
  maxOutputTokens: 200, // only need short outputs
  
  apiKey:process.env.GOOGLE_API_KEY
});
