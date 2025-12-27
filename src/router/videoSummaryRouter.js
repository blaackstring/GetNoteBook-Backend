import express from 'express';

const router = express.Router();

import { summary } from '../config/langraph/summaryController.js';

router.post('/', summary);

export default router;
