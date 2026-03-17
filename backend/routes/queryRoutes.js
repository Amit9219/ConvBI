const express = require('express');
const router = express.Router();
const { processQuery, getQueryHistory } = require('../controllers/queryController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, processQuery);
router.get('/history', protect, getQueryHistory);

module.exports = router;
