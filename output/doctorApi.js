import api from "./apiClient";

export const createDoctor = ({ data } = {}) =>
  api.post('/doctor/create', data);

export const getDocdata = ({ query } = {}) =>
  api.get('/doctor/getdocdata', { params: query });

