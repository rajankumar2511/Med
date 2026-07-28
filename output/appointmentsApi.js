import api from "./apiClient";

export const createBook = ({ data } = {}) =>
  api.post('/appointments/book', data);

export const getAvailabilityByDoctorId = ({ params, query } = {}) =>
  api.get(`/appointments/availability/${params.doctorId}`, { params: query });

export const getMy = ({ query } = {}) =>
  api.get('/appointments/my', { params: query });

export const cancelAppointment = ({ params, data } = {}) =>
  api.patch(`/appointments/${params.id}/cancel`, data);

