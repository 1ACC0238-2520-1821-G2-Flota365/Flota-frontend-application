import store from "../store";
import router from "../router";

export const authUtils = {
  /**
   * Verifica si el usuario tiene los permisos necesarios
   * @param {string|Array} roles - Rol o array de roles requeridos
   * @param {Object} user - Usuario actual
   * @returns {boolean}
   */
  hasRole(roles, user = null) {
    if (!user) {
      user = store.state.auth.user
    }
    
    if (!user || !user.role) return false
    
    if (typeof roles === 'string') {
      return user.role === roles
    }
    
    if (Array.isArray(roles)) {
      return roles.includes(user.role)
    }
    
    return false
  },

  /**
   * Verifica si el token es válido (no expirado)
   * @param {string} token - Token JWT
   * @returns {boolean}
   */
  isTokenValid(token = null) {
    if (!token) {
      token = store.state.auth.token
    }
    
    if (!token) return false
    
    try {
      // Decodificar JWT para verificar expiración
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000
      
      return payload.exp > currentTime
    } catch (error) {
      console.error('Error validating token:', error)
      return false
    }
  },

  /**
   * Redirige al login limpiando el estado
   */
  redirectToLogin() {
    store.dispatch('auth/logout')
    router.push('/login')
  },

  /**
   * Obtiene el usuario actual del store
   * @returns {Object|null}
   */
  getCurrentUser() {
    return store.state.auth.user
  },

  /**
   * Verifica si el usuario está autenticado
   * @returns {boolean}
   */
  isAuthenticated() {
    return store.state.auth.isAuthenticated && this.isTokenValid()
  }
}

// Middleware para rutas que requieren roles específicos
export const roleMiddleware = (roles) => {
  return (to, from, next) => {
    if (authUtils.hasRole(roles)) {
      next()
    } else {
      next({
        path: '/',
        query: { error: 'insufficient_permissions' }
      })
    }
  }
}