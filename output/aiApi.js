import api from "./apiClient";

export const createDoctorFinder = ({ data } = {}) =>
  api.post('/ai/doctor-finder', data);

