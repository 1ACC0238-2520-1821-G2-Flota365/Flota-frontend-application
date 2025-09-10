// services/api.js
import axios from 'axios'

const API_BASE_URL = ''

// Configuración de axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Interceptor para agregar token de autenticación
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Assignment API
export const assignmentAPI = {
  create: (data) => apiClient.post('/api/Assignment', data),
  getAll: () => apiClient.get('/api/Assignment'),
  start: (id) => apiClient.put(`/api/Assignment/${id}/start`),
  complete: (id) => apiClient.put(`/api/Assignment/${id}/complete`)
}

// Auth API
export const authAPI = {
  register: (data) => apiClient.post('/api/Auth/register', data),
  login: (data) => apiClient.post('/api/Auth/login', data),
  getProfile: () => apiClient.get('/api/Auth/profile'),
  getProfileById: (id) => apiClient.get(`/api/Auth/profile/${id}`),
  updateProfile: (id, data) => apiClient.put(`/api/Auth/profile/${id}`, data),
  changePassword: (id, data) => apiClient.post(`/api/Auth/change-password/${id}`, data),
  getUsers: () => apiClient.get('/api/Auth/users'),
  deleteUser: (id) => apiClient.delete(`/api/Auth/users/${id}`),
  health: () => apiClient.get('/api/Auth/health')
}

// Dashboard API
export const dashboardAPI = {
  getStats: () => apiClient.get('/api/Dashboard/stats'),
  getActiveVehicles: () => apiClient.get('/api/Dashboard/active-vehicles'),
  getFleetSummary: () => apiClient.get('/api/Dashboard/fleet-summary')
}

// Driver API
export const driverAPI = {
  create: (data) => apiClient.post('/api/Driver', data),
  getAll: () => apiClient.get('/api/Driver'),
  getById: (id) => apiClient.get(`/api/Driver/${id}`),
  update: (id, data) => apiClient.put(`/api/Driver/${id}`, data),
  delete: (id) => apiClient.delete(`/api/Driver/${id}`),
  getStats: () => apiClient.get('/api/Driver/stats')
}

// Fleets API
export const fleetsAPI = {
  getAll: () => apiClient.get('/api/Fleets'),
  create: (data) => apiClient.post('/api/Fleets', data),
  getById: (id) => apiClient.get(`/api/Fleets/${id}`),
  update: (id, data) => apiClient.put(`/api/Fleets/${id}`, data),
  delete: (id) => apiClient.delete(`/api/Fleets/${id}`)
}

// Maintenance API
export const maintenanceAPI = {
  // Records endpoints
  records: {
    getAll: () => apiClient.get('/api/Maintenance/records'),
    create: (data) => apiClient.post('/api/Maintenance/records', data),
    getById: (id) => apiClient.get(`/api/Maintenance/records/${id}`),
    update: (id, data) => apiClient.put(`/api/Maintenance/records/${id}`, data),
    delete: (id) => apiClient.delete(`/api/Maintenance/records/${id}`),
    getByVehicle: (vehicleId) => apiClient.get(`/api/Maintenance/records/vehicle/${vehicleId}`),
    getOverdue: () => apiClient.get('/api/Maintenance/records/overdue')
  },
  // Services endpoints
  services: {
    getAll: () => apiClient.get('/api/Maintenance/services'),
    create: (data) => apiClient.post('/api/Maintenance/services', data),
    getById: (id) => apiClient.get(`/api/Maintenance/services/${id}`),
    delete: (id) => apiClient.delete(`/api/Maintenance/services/${id}`),
    getByVehicle: (vehicleId) => apiClient.get(`/api/Maintenance/services/vehicle/${vehicleId}`)
  }
}

// Manager API
export const managerAPI = {
  create: (data) => apiClient.post('/api/Manager', data),
  getAll: () => apiClient.get('/api/Manager')
}

// Report API
export const reportAPI = {
  create: (data) => apiClient.post('/api/Report', data),
  getAll: () => apiClient.get('/api/Report')
}

// Vehicle API
export const vehicleAPI = {
  create: (data) => apiClient.post('/api/Vehicle', data),
  getAll: () => apiClient.get('/api/Vehicle'),
  getById: (id) => apiClient.get(`/api/Vehicle/${id}`),
  update: (id, data) => apiClient.put(`/api/Vehicle/${id}`, data),
  delete: (id) => apiClient.delete(`/api/Vehicle/${id}`)
}

// Alias para compatibilidad con código existente
export const vehiclesAPI = vehicleAPI
export const driversAPI = driverAPI

export default apiClient