import express from 'express';
import { RagStreamController, startquery } from '../controller/RagQueryController.js';

const   router = express.Router();

router.get('/stream/:jobId/:sessionId',RagStreamController);

router.post('/start',startquery)

export default router;
