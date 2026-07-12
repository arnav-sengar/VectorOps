#!/bin/bash
# TransitOps demo seed script
# Run this AFTER truncating tables and restarting the backend.
# Usage: bash seed.sh

BASE_URL="http://localhost:5000/api"

echo "== 1. Creating admin user =="
curl -s -X POST $BASE_URL/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name": "Alex Fleet", "email": "alex@transitops.com", "password": "password123", "role": "FleetManager"}' > /dev/null

TOKEN=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "alex@transitops.com", "password": "password123"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Token acquired."

echo "== 2. Creating vehicles =="
curl -s -X POST $BASE_URL/vehicles -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"registrationNumber": "VAN-01", "name": "Van 01", "type": "Van", "maxLoadCapacity": 500, "acquisitionCost": 18000, "region": "North"}' > /dev/null
curl -s -X POST $BASE_URL/vehicles -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"registrationNumber": "VAN-02", "name": "Van 02", "type": "Van", "maxLoadCapacity": 500, "acquisitionCost": 19000, "region": "North"}' > /dev/null
curl -s -X POST $BASE_URL/vehicles -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"registrationNumber": "TRK-01", "name": "Truck 01", "type": "Truck", "maxLoadCapacity": 2000, "acquisitionCost": 45000, "region": "South"}' > /dev/null
curl -s -X POST $BASE_URL/vehicles -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"registrationNumber": "TRK-02", "name": "Truck 02", "type": "Truck", "maxLoadCapacity": 2000, "acquisitionCost": 47000, "region": "South"}' > /dev/null
curl -s -X POST $BASE_URL/vehicles -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"registrationNumber": "BIKE-01", "name": "Bike 01", "type": "Bike", "maxLoadCapacity": 30, "acquisitionCost": 3000, "region": "East"}' > /dev/null
curl -s -X POST $BASE_URL/vehicles -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"registrationNumber": "VAN-03", "name": "Van 03", "type": "Van", "maxLoadCapacity": 500, "acquisitionCost": 17500, "region": "West"}' > /dev/null

echo "== 3. Creating drivers =="
curl -s -X POST $BASE_URL/drivers -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "Raj Kumar", "licenseNumber": "DL-1001", "licenseCategory": "LMV", "licenseExpiryDate": "2027-06-01", "contactNumber": "9000000001"}' > /dev/null
curl -s -X POST $BASE_URL/drivers -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "Priya Sharma", "licenseNumber": "DL-1002", "licenseCategory": "LMV", "licenseExpiryDate": "2027-08-15", "contactNumber": "9000000002"}' > /dev/null
curl -s -X POST $BASE_URL/drivers -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "Vikram Singh", "licenseNumber": "DL-1003", "licenseCategory": "HMV", "licenseExpiryDate": "2026-12-01", "contactNumber": "9000000003"}' > /dev/null
curl -s -X POST $BASE_URL/drivers -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "Anita Desai", "licenseNumber": "DL-1004", "licenseCategory": "HMV", "licenseExpiryDate": "2027-03-20", "contactNumber": "9000000004"}' > /dev/null
curl -s -X POST $BASE_URL/drivers -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "Sanjay Verma", "licenseNumber": "DL-1005", "licenseCategory": "LMV", "licenseExpiryDate": "2026-08-01", "contactNumber": "9000000005"}' > /dev/null
curl -s -X POST $BASE_URL/drivers -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "Meena Iyer", "licenseNumber": "DL-1006", "licenseCategory": "LMV", "licenseExpiryDate": "2025-01-01", "contactNumber": "9000000006"}' > /dev/null
# Note: Meena's license (DL-1006) is already EXPIRED (2025-01-01) - good for testing the block-on-dispatch rule

echo "== 4. Creating & completing trips (vehicle 1 + driver 1) =="
TRIP1=$(curl -s -X POST $BASE_URL/trips -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"source": "Warehouse A", "destination": "Warehouse B", "vehicleId": 1, "driverId": 1, "cargoWeight": 450, "plannedDistance": 120}' | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
curl -s -X PATCH $BASE_URL/trips/$TRIP1/dispatch -H "Authorization: Bearer $TOKEN" > /dev/null
curl -s -X PATCH $BASE_URL/trips/$TRIP1/complete -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"finalOdometer": 120, "fuelConsumed": 14, "actualDistance": 120}' > /dev/null

echo "== 5. Dispatching an active trip (vehicle 3 + driver 3) - left running =="
TRIP2=$(curl -s -X POST $BASE_URL/trips -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"source": "Depot X", "destination": "Depot Y", "vehicleId": 3, "driverId": 3, "cargoWeight": 1500, "plannedDistance": 300}' | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
curl -s -X PATCH $BASE_URL/trips/$TRIP2/dispatch -H "Authorization: Bearer $TOKEN" > /dev/null

echo "== 6. Creating a Draft trip (vehicle 4 + driver 4) - not yet dispatched =="
curl -s -X POST $BASE_URL/trips -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"source": "Hub 1", "destination": "Hub 2", "vehicleId": 4, "driverId": 4, "cargoWeight": 800, "plannedDistance": 90}' > /dev/null

echo "== 7. Creating & cancelling a trip (vehicle 5 + driver 5) =="
TRIP3=$(curl -s -X POST $BASE_URL/trips -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"source": "Yard A", "destination": "Yard B", "vehicleId": 5, "driverId": 5, "cargoWeight": 20, "plannedDistance": 15}' | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
curl -s -X PATCH $BASE_URL/trips/$TRIP3/dispatch -H "Authorization: Bearer $TOKEN" > /dev/null
curl -s -X PATCH $BASE_URL/trips/$TRIP3/cancel -H "Authorization: Bearer $TOKEN" > /dev/null

echo "== 8. Putting vehicle 6 into maintenance (stays In Shop) =="
curl -s -X POST $BASE_URL/maintenance -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"vehicleId": 6, "description": "Brake pad replacement", "cost": 3500}' > /dev/null

echo "== 9. Fuel logs =="
curl -s -X POST $BASE_URL/fuel-logs -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"vehicleId": 1, "liters": 14, "cost": 1400}' > /dev/null
curl -s -X POST $BASE_URL/fuel-logs -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"vehicleId": 3, "liters": 40, "cost": 4200}' > /dev/null
curl -s -X POST $BASE_URL/fuel-logs -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"vehicleId": 2, "liters": 10, "cost": 1050}' > /dev/null

echo "== 10. Expenses =="
curl -s -X POST $BASE_URL/expenses -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"vehicleId": 1, "type": "Toll", "amount": 150}' > /dev/null
curl -s -X POST $BASE_URL/expenses -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"vehicleId": 3, "type": "Other", "amount": 600, "notes": "Parking fee"}' > /dev/null

echo ""
echo "===== SEED COMPLETE ====="
echo "Login: alex@transitops.com / password123"
echo ""
echo "Vehicle states -> VAN-01: Available (completed 1 trip)"
echo "                  VAN-02: Available"
echo "                  TRK-01: On Trip (dispatched, still running)"
echo "                  TRK-02: Available (has a Draft trip pending)"
echo "                  BIKE-01: Available (trip was cancelled)"
echo "                  VAN-03: In Shop (maintenance active)"
echo ""
echo "Driver DL-1006 (Meena Iyer) has an EXPIRED license - use to test dispatch blocking"
