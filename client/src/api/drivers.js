import client from './client';

export const getDrivers = (params) => client.get('/drivers', { params }).then((r) => r.data);
export const getDriver = (id) => client.get(`/drivers/${id}`).then((r) => r.data);
export const createDriver = (payload) => client.post('/drivers', payload).then((r) => r.data);
export const updateDriver = (id, payload) => client.put(`/drivers/${id}`, payload).then((r) => r.data);
export const deleteDriver = (id) => client.delete(`/drivers/${id}`).then((r) => r.data);
