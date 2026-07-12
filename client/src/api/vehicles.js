import client from './client';

export const getVehicles = (params) => client.get('/vehicles', { params }).then((r) => r.data);
export const getVehicle = (id) => client.get(`/vehicles/${id}`).then((r) => r.data);
export const createVehicle = (payload) => client.post('/vehicles', payload).then((r) => r.data);
export const updateVehicle = (id, payload) => client.put(`/vehicles/${id}`, payload).then((r) => r.data);
export const deleteVehicle = (id) => client.delete(`/vehicles/${id}`).then((r) => r.data);
