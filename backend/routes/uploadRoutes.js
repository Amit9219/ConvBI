const express = require('express');
const router = express.Router();
const { upload, uploadCSV, getDatasets, getDatasetById, deleteDataset } = require('../controllers/uploadController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, upload.single('file'), uploadCSV);
router.get('/datasets', protect, getDatasets);
router.get('/datasets/:id', protect, getDatasetById);
router.delete('/datasets/:id', protect, deleteDataset);

module.exports = router;
