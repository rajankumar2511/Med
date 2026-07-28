import api from "./apiClient";

export const createMedical = ({ data } = {}) =>
  api.post('/medical/create', data);

export const createMsdata = ({ data } = {}) =>
  api.post('/medical/getmsdata', data);

