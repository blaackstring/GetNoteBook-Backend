import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'upload_transcript' });
});

export default router;
