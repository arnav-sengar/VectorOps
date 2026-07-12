import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute, RoleRoute } from './routes/ProtectedRoute.jsx';
import AppLayout from './components/layout/AppLayout.jsx';
import Reports from './pages/reports/Reports.jsx';

import Login from './pages/auth/Login.jsx';
import Signup from './pages/auth/Signup.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import VehicleList from './pages/vehicles/VehicleList.jsx';
import DriverList from './pages/drivers/DriverList.jsx';
import TripList from './pages/trips/TripList.jsx';
import MaintenanceList from './pages/maintenance/MaintenanceList.jsx';
import ExpenseList from './pages/expenses/ExpenseList.jsx';
import NotFound from './pages/NotFound.jsx';
import Unauthorized from './pages/Unauthorized.jsx';

const OPS_ROLES = ['FleetManager', 'SafetyOfficer'];
const FIN_ROLES = ['FleetManager', 'FinancialAnalyst'];
const TRIP_ROLES = ['FleetManager', 'Driver'];

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} handle={{ title: 'Dashboard' }} />

          <Route element={<RoleRoute roles={OPS_ROLES} />}>
            <Route path="/vehicles" element={<VehicleList />} handle={{ title: 'Vehicle Registry' }} />
            <Route path="/drivers" element={<DriverList />} handle={{ title: 'Drivers' }} />
            <Route path="/maintenance" element={<MaintenanceList />} handle={{ title: 'Maintenance' }} />
            
          </Route>

          <Route element={<RoleRoute roles={TRIP_ROLES} />}>
            <Route path="/trips" element={<TripList />} handle={{ title: 'Trips' }} />
          </Route>

          <Route element={<RoleRoute roles={FIN_ROLES} />}>
            <Route path="/expenses" element={<ExpenseList />} handle={{ title: 'Fuel & Expenses' }} />
            <Route path="/reports" element={<Reports />} handle={{ title: 'Reports' }} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
