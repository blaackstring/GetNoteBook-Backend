import { LoadPdf } from "../config/Load&Split/LoadPdfconfig.js"
import { splitText } from "../config/Load&Split/TextSplitter.js";
import { SaveVectorEmbeddings } from "../config/vectorEmbeddingsConfigs/SupabaseVDconfig.js";

export const UploadPdfController=async(req,res)=>{
    try {
        const {url}=req.body
        const loadpdfdocs=await LoadPdf(url ||'https://d3a6qvndldqlr.cloudfront.net/2617a9b3-f957-4593-b6b4-12cf456268a1-.pdf');
        const docs_with_id= await splitText(loadpdfdocs)
       await SaveVectorEmbeddings(docs_with_id);

      res.status(200).send('pdf uploaded successfully');
    } catch (error) {
        console.log('error while Uploading pdf',error)
    }
}