import { createAgent } from "langchain";
import { llm } from "../LLMconfig/LLM.js";
import { checkpointer, retrieveDocsTool, summarizationmiddleware} from "./langraph_components.js";
import { ragContextMiddleware } from "./middleware.js";

const systemPrompt=`You are a Retrieval-Augmented Generation (RAG) assistant.


Conversation Memory Rule:
- You ARE allowed to use the current conversation history
  ONLY for meta-questions such as:
  - "What was my previous question?"
  - "What did I ask earlier?"
  - "Summarize our conversation"
  - "you can answer Price Discrimination etc type questions..."

Response limits:
- Normal answers: max 140 words
- Summaries: 50–60 words
`
export const agent = createAgent({
    model:llm,
    systemPrompt: systemPrompt,
    tools:[retrieveDocsTool],
    middleware:[ragContextMiddleware,summarizationmiddleware],
    checkpointer
})



// const rl=readLine.createInterface({
//     input:process.stdin,
//     output:process.stdout

// })

// const Main=async()=>{
//     const question=await new Promise((res,rej)=>{
//         rl.question("enter Question : ",(ques)=>{
//             res(ques);
//         })
//     })
// //     const res=await agent.invoke(
// //     {
// //         messages:[
// //             {role:"user",content: question}
// //         ]
// //     },
// //     config
// //     );
// // console.log("Agent Response:", res.messages.at(-1).content);


// for await (const [token, metadata] of await agent.stream(
//   {
//     messages: [
//       { role: "user", content: question }
//     ],
//   },
//   {
//     ...config,
//     streamMode: "messages",
//   }
// )) {
//   let contentStr="";
//    for( let text of token.contentBlocks){
//     contentStr+=text.text;
//     console.log(contentStr);
    
//    }
// }
// Main();
// }


// Main();
