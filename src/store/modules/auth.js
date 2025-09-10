// store/modules/auth.js
const state = {
  user: null,
  token: localStorage.getItem('auth_token'),
  isAuthenticated: false, // Temporalmente false para desarrollo
  loading: false,
  error: null
}

const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  SET_TOKEN(state, token) {
    state.token = token
    state.isAuthenticated = !!token
    if (token) {
      localStorage.setItem('auth_token', token)
    } else {
      localStorage.removeItem('auth_token')
    }
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  LOGOUT(state) {
    state.user = null
    state.token = null
    state.isAuthenticated = false
    localStorage.removeItem('auth_token')
  }
}

const actions = {
  async login({ commit }, credentials) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      // Simulación temporal - en producción conectar con API real
      console.log('Login attempt with:', credentials)
      
      // Simular respuesta exitosa para desarrollo
      const mockResponse = {
        data: {
          token: 'mock-jwt-token-for-development',
          user: {
            id: 1,
            firstName: 'Usuario',
            lastName: 'Demo',
            email: credentials.email,
            role: 'Admin'
          }
        }
      }
      
      const { token, user } = mockResponse.data
      commit('SET_TOKEN', token)
      commit('SET_USER', user)
      
      return mockResponse.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Error de autenticación')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  logout({ commit }) {
    commit('LOGOUT')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}