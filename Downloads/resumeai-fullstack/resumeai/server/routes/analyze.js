const express = require('express');
const { analyzeResume, getCoverLetter, getKeywords, getAnalysesHistory, verifyAuth, clearAnalysesHistory, getAnalysisDetail } = require('../controllers/analyzeController');

const router = express.Router();
router.post('/analyze', analyzeResume);
router.post('/cover-letter', getCoverLetter);
router.post('/keywords', getKeywords);
router.post('/verify', verifyAuth);
router.get('/history', getAnalysesHistory);
router.get('/history/:id', getAnalysisDetail);
router.delete('/history', clearAnalysesHistory);
module.exports = router;
