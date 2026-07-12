import { useEffect, useState } from 'react';
import Card from '../../components/ui/Card.jsx';
import { getFleetReport, exportFleetCsv } from '../../api/reports.js';

export default function Reports() {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getFleetReport()
      .then(setReport)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleExport = async () => {
    const blob = await exportFleetCsv();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fleet_report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Fleet Report</h1>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-amber-500 text-white rounded-md text-sm font-medium"
        >
          Export CSV
        </button>
      </div>

      <Card title="Per-vehicle summary">
        {loading && <p className="text-sm text-ink/50">Loading…</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink/50 border-b">
                  <th className="py-2 pr-4">Vehicle</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Trips</th>
                  <th className="py-2 pr-4">Distance (km)</th>
                  <th className="py-2 pr-4">Fuel Efficiency (km/L)</th>
                  <th className="py-2 pr-4">Total Cost</th>
                  <th className="py-2 pr-4">ROI %</th>
                </tr>
              </thead>
              <tbody>
                {report.map((r) => (
                  <tr key={r.registrationNumber} className="border-b border-black/5">
                    <td className="py-2 pr-4">{r.registrationNumber} — {r.vehicleName}</td>
                    <td className="py-2 pr-4">{r.status}</td>
                    <td className="py-2 pr-4">{r.totalTrips}</td>
                    <td className="py-2 pr-4">{r.totalDistanceKm}</td>
                    <td className="py-2 pr-4">{r.fuelEfficiencyKmPerL}</td>
                    <td className="py-2 pr-4">₹{r.totalOperationalCost.toLocaleString('en-IN')}</td>
                    <td className="py-2 pr-4">{r.roiPercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {report.length === 0 && <p className="text-sm text-ink/40 mt-4">No vehicles yet.</p>}
          </div>
        )}
      </Card>
    </div>
  );
}