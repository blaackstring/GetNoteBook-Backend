import { SystemMessage, HumanMessage } from "@langchain/core/messages";

export function buildRagSystemMessage(contextText) {
  return new SystemMessage({
    content: [
      {
        type: "text",
        text: `
You are a Retrieval-Augmented assistant.

Rules:
- Use ONLY the provided document context.
- If the user asks for a summary, produce a concise summary.
- Otherwise, answer the question directly.
`.trim()
      },
      {
        type: "text",
        text: contextText,
        cache_control: { type: "ephemeral" } // 🔥 THIS IS THE KEY
      }
    ]
  });
}
