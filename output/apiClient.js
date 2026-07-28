import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// Structured error interceptor — fixes issue #7.
// Every API error is normalised to { status, message, data }
// so consumers never need to inspect raw Axios error internals.
api.interceptors.response.use(
  (response) => response,
  (err) => {
    const status  = err.response?.status  ?? 0;
    const message = err.response?.data?.message ?? err.message ?? "Unknown error";
    const data    = err.response?.data    ?? null;
    return Promise.reject({ status, message, data });
  }
);

export default api;
