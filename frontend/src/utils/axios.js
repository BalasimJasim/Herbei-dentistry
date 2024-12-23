import axios from 'axios'
import { toast } from 'react-hot-toast'

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data)
      toast.error(error.response.data.message || 'An error occurred')
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request)
      toast.error('Network error. Please check your connection.')
    } else {
      // Something else happened
      console.error('Error:', error.message)
      toast.error('An unexpected error occurred')
    }
    return Promise.reject(error)
  }
)

export default api 