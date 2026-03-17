const express = require('express');
const router = express.Router();
const { getDashboardById, saveDashboard, getDashboards } = require('../controllers/dashboardController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getDashboards);
router.get('/:id', protect, getDashboardById);
router.post('/', protect, saveDashboard);

module.exports = router;
