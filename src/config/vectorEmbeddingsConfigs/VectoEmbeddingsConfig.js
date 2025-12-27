import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import dotenv from 'dotenv';
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
dotenv.config({path:'../../../.env'});

const supabaseKey = process.env.SUPABASE_API_KEY
if (!supabaseKey) throw new Error(`Expected SUPABASE_SERVICE_ROLE_KEY`)
const url = process.env.SUPABASE_URL
if (!url) throw new Error(`Expected env var SUPABASE_URL`)
const trimmedUrl = url.trim();

export const Client =createClient(trimmedUrl,supabaseKey)

export const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004",
  taskType: TaskType.RETRIEVAL_DOCUMENT,
  outputDimensionality: 1536,
  title: "Custom Vector Embeddings with Google GenAI",
  apiKey:process.env.GOOGLE_API_KEY
});

export const vectorStore = new SupabaseVectorStore(embeddings, {
    client:Client,
    tableName: 'documents',
    queryName: 'match_documents'
})


