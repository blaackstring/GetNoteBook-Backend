import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { splitText } from "./TextSplitter.js";
import { response } from "express";
import fs from "fs";
import path from "path";

export const LoadPdf = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch PDF");
  }

  const buffer = await res.arrayBuffer(); //it make a buffer[010001010] array ;

  const temp_path = path.join(process.cwd(), "temp.pdf");

  `
  fs.writeFileSync(tempPath, Buffer.from(buffer));
🔥 This is the MOST important line
Why Buffer.from(buffer)?

Because:

arrayBuffer() → Web standard

fs.writeFileSync() → Node.js standard

Node does NOT understand ArrayBuffer directly
  `;
  fs.writeFileSync(temp_path, Buffer.from(buffer));

  const loader = new PDFLoader(temp_path);
  const docs = await loader.load();

  console.log(docs);
  return docs;
  // console.log('-----------------------------------')
  // await splitText(docs)
};
