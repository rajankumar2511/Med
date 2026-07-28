import api from "./apiClient";

export const createNearby = ({ data } = {}) =>
  api.post('/map/nearby', data);

