import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add authentication token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

/**
 * Check the backend health status
 * @returns {Promise<{status: string, message: string}>}
 */
export const checkBackendHealth = async () => {
  try {
    const response = await apiClient.get('/health')
    return {
      status: 'healthy',
      message: response.data?.message || 'Backend is running'
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      message: error.message || 'Failed to connect to backend'
    }
  }
}

export default apiClient
