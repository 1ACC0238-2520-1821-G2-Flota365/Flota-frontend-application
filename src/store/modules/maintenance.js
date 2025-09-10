import { maintenanceAPI } from '@/services/api'

const state = {
  records: [],
  services: [],
  overdueRecords: [],
  loading: false,
  error: null
}

const mutations = {
  SET_RECORDS(state, records) {
    state.records = records
  },
  SET_SERVICES(state, services) {
    state.services = services
  },
  SET_OVERDUE_RECORDS(state, records) {
    state.overdueRecords = records
  },
  ADD_RECORD(state, record) {
    state.records.push(record)
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async fetchMaintenanceRecords({ commit }) {
    commit('SET_LOADING', true)
    try {
      const response = await maintenanceAPI.getRecords()
      commit('SET_RECORDS', response.data)
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error fetching maintenance records:', error)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchOverdueRecords({ commit }) {
    try {
      const response = await maintenanceAPI.getOverdueRecords()
      commit('SET_OVERDUE_RECORDS', response.data)
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error fetching overdue records:', error)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
