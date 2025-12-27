import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { embeddings } from "./VectoEmbeddings.js";
import {PromptTemplate} from "@langchain/core/prompts"
import dotenv from 'dotenv';
import { client } from "./SupabaseVDconfig.js";
import { llm } from "../LLMconfig/LLM.js";
dotenv.config({path:'../../../.env'});



export async function saveMessage(data, role) {
    return await vectorStore.addDocuments([
        {
        metadata: {
                role
            },
            pageContent: data,
        }
    ])
}


const template = `
You are a helpful assistant.
Answer the question using the context below if relevant.
If the context is not useful, rely on your own knowledge.
if the user ask what is RAG, then answer in detail.
if the user ask what is vector database, then answer in detail.
if the user ask what is vector embedding, then answer in detail.
if the user ask what is vector search, then answer in detail.
if the user ask about what is my last question , it means it asked user last-1 question .
if user i asked you give him the last question, if user
want answer of last question give both last question of user and answer of last question.
User Question: {user_question}
Standalone Question: {standalone_user_question}

Context:
{context}
`;
export default async function RagQuery(standalone_user_question,user_question) {
    await saveMessage(user_question, 'user')

   const arrayofDocument = await vectorStore.similaritySearch(standalone_user_question, 15);

  const context = arrayofDocument.map(doc => `${doc.metadata.role}: ${doc.pageContent}`).join('\n'); // it will return string of all messages


const prompt = new PromptTemplate({
  template,
  inputVariables: ["user_question", "standalone_user_question", "context"]
});

// Later when running:
const formattedPrompt = await prompt.format({
  user_question,
  standalone_user_question,
  context
});

const res = await llm.invoke(formattedPrompt);
await saveMessage(res.text.trim(), 'assistant')
console.log('----------------------------------RAG Response----------------------------------');
console.log(res.text.trim());
    return res;
}
