import { authUtils } from '@/utils/auth'

export const setupResponseInterceptors = (apiClient) => {
  // Interceptor para manejar respuestas de error globalmente
  apiClient.interceptors.response.use(
    response => response,
    error => {
      const status = error.response?.status
      
      switch (status) {
        case 401:
          // Token expirado o inválido
          if (authUtils.isAuthenticated()) {
            store.commit('SHOW_NOTIFICATION', {
              message: 'Su sesión ha expirado. Por favor inicie sesión nuevamente.',
              type: 'warning'
            })
            authUtils.redirectToLogin()
          }
          break
          
        case 403:
          // Sin permisos
          store.commit('SHOW_NOTIFICATION', {
            message: 'No tiene permisos para realizar esta acción.',
            type: 'error'
          })
          break
          
        case 404:
          // Recurso no encontrado
          store.commit('SHOW_NOTIFICATION', {
            message: 'El recurso solicitado no existe.',
            type: 'error'
          })
          break
          
        case 422:
          // Errores de validación
          const errors = error.response?.data?.errors
          if (errors) {
            const errorMessages = Object.values(errors).flat()
            store.commit('SHOW_NOTIFICATION', {
              message: `Errores de validación: ${errorMessages.join(', ')}`,
              type: 'error'
            })
          }
          break
          
        case 500:
        case 502:
        case 503:
        case 504:
          // Errores del servidor
          store.commit('SHOW_NOTIFICATION', {
            message: 'Error del servidor. Intente más tarde.',
            type: 'error'
          })
          break
          
        default:
          // Error genérico
          if (error.message === 'Network Error') {
            store.commit('SHOW_NOTIFICATION', {
              message: 'Error de conexión. Verifique su conexión a internet.',
              type: 'error'
            })
          } else {
            store.commit('SHOW_NOTIFICATION', {
              message: error.response?.data?.message || 'Ha ocurrido un error inesperado.',
              type: 'error'
            })
          }
      }
      
      return Promise.reject(error)
    }
  )
}