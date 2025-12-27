import readLine from 'readline';
import RagQuery from './Query.js';
import { llm } from '../LLMconfig/LLM.js';
import { PromptTemplate } from '@langchain/core/prompts';




const rl=readLine.createInterface({
    input:process.stdin,
    output:process.stdout

})

const main=async()=>{
  const question=await new Promise((res,rej)=>{
    rl.question('enter your Question',(user_question)=>{
      res(user_question);
    })
  })

 const startTime = Date.now();
 
 let result= await generateStandaloneQuery(question); // standalone_question
     console.log("Standalone Query:", result);
     
 let RagResponse=await RagQuery(result,question)
  //  console.log("RAG Response:", RagResponse.text.trim());
   
 const endTime = Date.now();
 console.log(`Total response time: ${endTime - startTime}ms`);
  main();
}

main()


const StandalonePromptTemplate = `
Convert questions into concise standalone queries (2–10 words).
Output only key words/phrases, no extra text.
Examples:
Q: "How does Supabase vector search work in RAG?"
A: "Supabase vector search RAG"
Now, condense: {user_question}
`;

async function generateStandaloneQuery(user_question) {
    console.log('Generating standalone query for:', user_question);
  // just format once — returns a string
  const standalonePrompt = await PromptTemplate.fromTemplate(
    StandalonePromptTemplate
  ).format({ user_question });  

  // pass string directly (not array, not .toString())
  const response = await llm.invoke(standalonePrompt);

  return response.text.trim();
}

export { generateStandaloneQuery };