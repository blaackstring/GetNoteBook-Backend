import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters";
import { Document } from "langchain";
import dotenv from 'dotenv';
import { meta } from "zod/v4/core";
import { SaveVectorEmbeddings } from "../vectorEmbeddingsConfigs/SupabaseVDconfig.js";
// import { SaveVectorEmbeddings } from "../vectorEmbeddingsConfigs/SupabaseVDconfig.js";
dotenv.config({path:'../../../.env'});

const textSplitter=new RecursiveCharacterTextSplitter({
    chunkSize:500,
    separators:["\n\n","\n"," ",""],
    chunkOverlap:10
})

export const CreateDocument=async({text})=>{
 
  
 const splitDocs= await textSplitter.createDocuments([text])

   const docs_with_id= await docsWithMetadata(splitDocs,'youtube_transcript');
   console.log(docs_with_id);
   SaveVectorEmbeddings(docs_with_id);
  
}
export const splitText=async(docs)=>{
    try {
        const splitDocs=await textSplitter.splitDocuments(docs);
        console.log(splitDocs);
        const docs_with_id= await docsWithMetadata(splitDocs);
        return docs_with_id;

    } catch (error) {
        console.log("Error while splitting text:", error);
        throw error;
    }
}


const docsWithMetadata=async(docs,source='pdf_document')=>{

    return docs.map((doc,idx)=>{
            const chunkId = `${source}_chunk_${idx + 1}`;  
      return new Document({
        pageContent:doc.pageContent,
        metadata:{
          source:doc.metadata.source,
          chunkId:chunkId,
          chunk_id:idx+1
        }
      })
    })
}
