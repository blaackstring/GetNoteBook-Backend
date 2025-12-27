import express from 'express';
import { UploadPdfController } from '../controller/UploadPdfController.js';

const router = express.Router();

router.post('/', UploadPdfController);

export default router;
