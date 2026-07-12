const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createFuelLog,
  getFuelLogs,
  createExpense,
  getExpenses,
  getVehicleCostSummary,
} = require('../controllers/fuelExpenseController');

router.use(protect);

router.post('/fuel-logs', createFuelLog);
router.get('/fuel-logs', getFuelLogs);
router.get('/fuel-logs/cost-summary/:vehicleId', getVehicleCostSummary);

router.post('/expenses', createExpense);
router.get('/expenses', getExpenses);

module.exports = router;
