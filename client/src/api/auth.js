import client from './client';

export const login = (payload) => client.post('/auth/login', payload).then((r) => r.data);
export const signup = (payload) => client.post('/auth/signup', payload).then((r) => r.data);
export const me = () => client.get('/auth/me').then((r) => r.data);
