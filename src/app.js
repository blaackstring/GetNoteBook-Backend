import express from 'express';
import webSearchRouter from './router/webSearchRouter.js';
import ragQueryRouter from './router/ragQueryRouter.js';
import videoSummaryRouter from './router/videoSummaryRouter.js';
import uploadPdfRouter from './router/uploadPdfRouter.js';
import uploadTranscriptRouter from './router/uploadTranscriptRouter.js';
import fetchYoutubeScriptRouter from './router/fetchYoutubeScriptRouter.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { GenerateSignedUrl } from './controller/S3UploadController.js';
const app = express();

app.use(cookieParser())

app.use(express.json())


app.use(express.urlencoded({ extended: true }));// it is used to parse URL-encoded request bodies


app.use(cors(
))

app.use('/api/v1/rag_query', ragQueryRouter);

app.use('/api/v1/fetch_youtube_script', fetchYoutubeScriptRouter);

app.use('/api/v1/upload_transcript', uploadTranscriptRouter);


app.use('/api/v1/web_search', webSearchRouter);


app.use('/api/v1/video_summary', videoSummaryRouter);
//-----------------iam uplding pdff here----------
app.use('/api/v1/upload_pdf', uploadPdfRouter);

app.use('/api/v1/get-Presigned-Url', GenerateSignedUrl)

export default app;
