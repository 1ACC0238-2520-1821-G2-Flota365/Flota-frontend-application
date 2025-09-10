import Vue from 'vue'
import { driversAPI } from '@/services/api'

const state = {
  drivers: [],
  currentDriver: null,
  driverStats: null,
  loading: false,
  error: null
}

const mutations = {
  SET_DRIVERS(state, drivers) {
    state.drivers = drivers
  },
  SET_CURRENT_DRIVER(state, driver) {
    state.currentDriver = driver
  },
  SET_DRIVER_STATS(state, stats) {
    state.driverStats = stats
  },
  ADD_DRIVER(state, driver) {
    state.drivers.push(driver)
  },
  UPDATE_DRIVER(state, updatedDriver) {
    const index = state.drivers.findIndex(d => d.id === updatedDriver.id)
    if (index !== -1) {
      Vue.set(state.drivers, index, updatedDriver)
    }
  },
  REMOVE_DRIVER(state, driverId) {
    state.drivers = state.drivers.filter(d => d.id !== driverId)
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async fetchDrivers({ commit }) {
    commit('SET_LOADING', true)
    try {
      const response = await driversAPI.getAll()
      commit('SET_DRIVERS', response.data)
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error fetching drivers:', error)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchDriverStats({ commit }) {
    try {
      const response = await driversAPI.getStats()
      commit('SET_DRIVER_STATS', response.data)
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error fetching driver stats:', error)
    }
  },

  async createDriver({ commit }, driverData) {
    commit('SET_LOADING', true)
    try {
      const createDriverDto = {
        firstName: driverData.firstName,
        lastName: driverData.lastName,
        licenseNumber: driverData.licenseNumber,
        licenseExpiryDate: driverData.licenseExpiry,
        phone: driverData.phone || null,
        email: driverData.email || null,
        experienceYears: driverData.experience || 0
      }
      
      const response = await driversAPI.create(createDriverDto)
      commit('ADD_DRIVER', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error creating driver:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async updateDriver({ commit }, { id, driverData }) {
    commit('SET_LOADING', true)
    try {
      const updateDriverDto = {
        firstName: driverData.firstName,
        lastName: driverData.lastName,
        licenseNumber: driverData.licenseNumber,
        licenseExpiryDate: driverData.licenseExpiry,
        phone: driverData.phone || null,
        email: driverData.email || null,
        experienceYears: driverData.experience || 0,
        status: driverData.status || 1
      }
      
      const response = await driversAPI.update(id, updateDriverDto)
      commit('UPDATE_DRIVER', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error updating driver:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async deleteDriver({ commit }, id) {
    commit('SET_LOADING', true)
    try {
      await driversAPI.delete(id)
      commit('REMOVE_DRIVER', id)
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error deleting driver:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const getters = {
  activeDrivers: (state) => {
    return state.drivers.filter(d => d.status === 1 || d.statusName === 'Active')
  },
  driversWithExpiringLicenses: (state) => {
    return state.drivers.filter(d => d.isLicenseExpiringSoon)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}