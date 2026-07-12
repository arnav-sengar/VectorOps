const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getMaintenanceLogs,
  createMaintenance,
  closeMaintenance,
} = require('../controllers/maintenanceController');

router.use(protect);

router.get('/', getMaintenanceLogs);
router.post('/', authorize('FleetManager'), createMaintenance);
router.patch('/:id/close', authorize('FleetManager'), closeMaintenance);

module.exports = router;
