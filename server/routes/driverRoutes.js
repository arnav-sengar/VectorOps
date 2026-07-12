const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getDrivers,
  getAvailableDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
} = require('../controllers/driverController');

router.use(protect);

router.get('/', getDrivers);
router.get('/available', getAvailableDrivers);
router.post('/', authorize('FleetManager', 'SafetyOfficer'), createDriver);
router.put('/:id', authorize('FleetManager', 'SafetyOfficer'), updateDriver);
router.delete('/:id', authorize('FleetManager'), deleteDriver);

module.exports = router;
