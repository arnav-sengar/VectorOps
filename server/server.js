require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/vehicles', require('./routes/vehicleRoutes'));
app.use('/api/drivers', require('./routes/driverRoutes'));
app.use('/api/trips', require('./routes/tripRoutes'));
app.use('/api/maintenance', require('./routes/maintenanceRoutes'));
app.use('/api', require('./routes/fuelExpenseRoutes')); // /api/fuel-logs, /api/expenses
app.use('/api', require('./routes/reportRoutes')); // /api/dashboard/kpis, /api/reports/*

// Global error handler (catches anything unhandled)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
