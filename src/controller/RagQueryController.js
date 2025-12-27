import { agent } from "../config/langraph/Agent.js";
import {v4 as uuid} from "uuid"

const systemPrompt = `
You are a Retrieval-Augmented assistant.

The retrieved context IS the document.

First, classify the user's intent:
- If the user explicitly asks for a summary (words like: "summarise", "summary", "overview"),
  then generate a concise summary of the document in 50–70 sentences.
- Otherwise, treat the input as a question and answer it using ONLY the document.

Answering rules:
- Keep answers concise and focused.
- Use at most 300 words.
- Prefer direct statements over explanations.
- Do not add background or examples unless explicitly asked.
`;

const jobs=new Map();
export const RagStreamController = async (req, res) => {
  try {
  const { jobId ,sessionId} = req.params;
  console.log(jobId,sessionId);
  
  const job = jobs.get(jobId);

  if (!job || !sessionId) {
    return res.status(404).end();
  }

  const { query } = job;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    
    res.flushHeaders?.();
    let clientconnected = true;

    req.on("close", () => {
      console.log("Client disconnected");
      clientconnected = false;
    });

    for await (const [token] of await agent.stream(
      {
        messages: [
          { role: "user", content: query }],
      },
      {
        configurable:{
          thread_id:sessionId
        },
        streamMode: "messages",
      }
    )) 
    {
      if (!clientconnected) {res.write(`retry: 3000\n`);
        break;
} 
     for (const block of token.contentBlocks ?? []) {
      
       
        res.write(`data: ${block.text}\n\n`);
      }
    }
res.write(`event: end\ndata: done\n\n`);

    res.end();
    jobs.delete(jobId);


  } catch (error) {
    console.log("Error in RagQueryController:", error);

    res.status(500).json({ error: "Internal Server Error" });
    throw error;
  }
};


export const startquery=async(req,res)=>{
   
   try {
      
    const { query } = req?.body;
console.log(query);

    if (!query)return res  .status(400) .json({ error: "Missing sessionId or query in request body" });
    const jobId=uuid();


    jobs.set(jobId,{query})

  res.json({ jobId });
   } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });

    console.log("Error in start:", error);
    throw error;
   }
}