import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';
import { embeddings } from './VectoEmbeddingsConfig.js';
dotenv.config({path:'../../../.env'});


const supabaseKey = process.env.SUPABASE_API_KEY
if (!supabaseKey) throw new Error(`Expected SUPABASE_SERVICE_ROLE_KEY`)
const url = process.env.SUPABASE_URL
if (!url) throw new Error(`Expected env var SUPABASE_URL`)
const trimmedUrl = url.trim();

export const client =createClient(trimmedUrl,supabaseKey)



export const SaveVectorEmbeddings=async(splittedDocs)=>{
    try {
        
         const Vs=await SupabaseVectorStore.fromDocuments(splittedDocs,embeddings,{
            client,
            tableName:'documents',
            queryName:'match_documents'
         })
        
       console.log("Vector store created successfully",Vs);
       return true;
    } catch (error) {
        console.error("Error creating vector store:", error);
        throw error;
    }
}
