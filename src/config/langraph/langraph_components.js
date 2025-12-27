import { vectorStore } from "../vectorEmbeddingsConfigs/VectoEmbeddingsConfig.js";
import { tool } from "@langchain/core/tools"; 
import * as z from "zod"
import {MemorySaver} from "@langchain/langgraph"
import { summarizationMiddleware } from "langchain";
import { llm } from "../LLMconfig/LLM.js";

/*
tool-> Creates a new StructuredTool instance with the provided function, name, description, and schema.
      Schema can be provided as Zod or JSON schema, and both will be validated.
*/ 

const retriver=vectorStore.asRetriever({
    k:3,
})


const retrieveDocsTool=tool(
    async({query})=>{
            const searchResults=await retriver.invoke(query);
            console.log(searchResults);
            return searchResults.map((doc,i)=>`Document${i+1}:\n${doc?.pageContent}
            ${doc?.metadata?.source}
            `).join('\n\n');
    }
    ,
    {
        name:'retrive_docs',
        description:'useful for when you need to retrive relevant documents.',
        schema:z.object({
            query:z.string().describe('user query to retrive relevant documents from vector database')
        })
    }
)//the tool is used to retrieve relevant documents from the vector database based on a user query.


const checkpointer = new MemorySaver(); //checkpointing memory saver is used to save the state of the agent at various points in time.

const summarizationmiddleware=summarizationMiddleware({
    model:llm,
    triggerWords:["summarize","summary","summarization","summarise"],
    trigger:{tokens:1000,},
    keep:{messages:15}
}) //when the total tokens in the conversation exceed 3000, it will summarize the conversation to keep it concise.

export {retrieveDocsTool,checkpointer,summarizationmiddleware};