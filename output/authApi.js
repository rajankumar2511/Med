import api from "./apiClient";

export const signup = ({ data } = {}) =>
  api.post('/auth/signup', data);

export const login = ({ data } = {}) =>
  api.post('/auth/login', data);

export const logout = ({ data } = {}) =>
  api.post('/auth/logout', data);

export const getMe = ({ query } = {}) =>
  api.get('/auth/me', { params: query });

