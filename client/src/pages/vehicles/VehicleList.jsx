import { useEffect, useState } from 'react';
import Card from '../../components/ui/Card.jsx';
import Table from '../../components/ui/Table.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Input from '../../components/ui/Input.jsx';
import { getVehicles, createVehicle, updateVehicle } from '../../api/vehicles.js';

const STATUS_TONE = {
  Available: 'go',
  OnTrip: 'transit',
  Maintenance: 'hold',
  OutOfService: 'stop',
};

// Local mock data so the screen is fully clickable before the backend route is live.
const MOCK_VEHICLES = [
  { id: '1', registrationNumber: 'UP32 AB 1234', make: 'Tata', model: 'Ace', year: 2022, status: 'Available', odometer: 18240 },
  { id: '2', registrationNumber: 'UP32 CD 5678', make: 'Mahindra', model: 'Bolero Pickup', year: 2021, status: 'OnTrip', odometer: 42110 },
  { id: '3', registrationNumber: 'UP32 EF 9012', make: 'Ashok Leyland', model: 'Dost', year: 2023, status: 'Maintenance', odometer: 9820 },
];

const EMPTY_FORM = { registrationNumber: '', make: '', model: '', year: '', status: 'Available', odometer: '' };

export default function VehicleList() {
  const [vehicles, setVehicles] = useState(MOCK_VEHICLES);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getVehicles()
      .then((data) => {
        setVehicles(data);
        setUsingMock(false);
      })
      .catch(() => setUsingMock(true)) // backend not ready yet — keep mock data
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (vehicle) => {
    setEditingId(vehicle.id);
    setForm(vehicle);
    setModalOpen(true);
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (usingMock) {
        // local-only update until API is wired
        if (editingId) {
          setVehicles((prev) => prev.map((v) => (v.id === editingId ? { ...form, id: editingId } : v)));
        } else {
          setVehicles((prev) => [...prev, { ...form, id: String(Date.now()) }]);
        }
      } else if (editingId) {
        const updated = await updateVehicle(editingId, form);
        setVehicles((prev) => prev.map((v) => (v.id === editingId ? updated : v)));
      } else {
        const created = await createVehicle(form);
        setVehicles((prev) => [...prev, created]);
      }
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: 'registrationNumber', header: 'Reg. No.', render: (r) => <span className="font-mono">{r.registrationNumber}</span> },
    { key: 'makeModel', header: 'Vehicle', render: (r) => `${r.make} ${r.model} (${r.year})` },
    { key: 'odometer', header: 'Odometer', render: (r) => `${Number(r.odometer).toLocaleString('en-IN')} km` },
    { key: 'status', header: 'Status', render: (r) => <Badge tone={STATUS_TONE[r.status] || 'neutral'}>{r.status}</Badge> },
    {
      key: 'actions',
      header: '',
      render: (r) => (
        <button className="text-sm text-signal-dark font-medium" onClick={() => openEdit(r)}>
          Edit
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Card
        title={`Vehicle Registry${usingMock ? ' (mock data)' : ''}`}
        action={<Button onClick={openAdd}>Add vehicle</Button>}
      >
        <Table columns={columns} rows={vehicles} loading={loading} emptyMessage="No vehicles registered yet." />
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit vehicle' : 'Add vehicle'}>
        <form onSubmit={onSave} className="space-y-4">
          <Input
            label="Registration number"
            required
            value={form.registrationNumber}
            onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Make" required value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} />
            <Input label="Model" required value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Year"
              type="number"
              required
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            />
            <Input
              label="Odometer (km)"
              type="number"
              value={form.odometer}
              onChange={(e) => setForm({ ...form, odometer: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-ink/70">Status</label>
            <select
              className="rounded border border-ink/15 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-signal/40 focus:border-signal outline-none"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              {Object.keys(STATUS_TONE).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save vehicle'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
