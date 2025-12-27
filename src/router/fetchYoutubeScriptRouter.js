import express from 'express';
import { FetchYoutubeScriptController } from '../controller/FetchYoutubeScriptController.js';

const router = express.Router();

router.get('/:transcriptId', FetchYoutubeScriptController);

export default router;
