// store/index.js
import Vue from 'vue'
import Vuex from 'vuex'

// Importar todos los módulos existentes
import auth from './modules/auth'
import dashboard from './modules/dashboard'
import drivers from './modules/drivers'
import fleets from './modules/fleets'
import maintenance from './modules/maintenance'
import notifications from './modules/notifications'
import vehicles from './modules/vehicles'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    dashboard,
    drivers,
    fleets,
    maintenance,
    notifications,
    vehicles
  },
  state: {
    loading: false,
    loadingMessage: '',
    error: null
  },
  mutations: {
    SET_LOADING(state, payload) {
      if (typeof payload === 'boolean') {
        state.loading = payload
        state.loadingMessage = payload ? 'Cargando...' : ''
      } else {
        state.loading = payload.loading || false
        state.loadingMessage = payload.message || 'Cargando...'
      }
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    CLEAR_ERROR(state) {
      state.error = null
    }
  },
  actions: {
    setLoading({ commit }, payload) {
      commit('SET_LOADING', payload)
    },
    setError({ commit }, error) {
      commit('SET_ERROR', error)
    },
    clearError({ commit }) {
      commit('CLEAR_ERROR')
    }
  }
})