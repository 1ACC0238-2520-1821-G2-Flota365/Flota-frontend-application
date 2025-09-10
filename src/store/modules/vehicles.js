import Vue from 'vue'
import { vehiclesAPI } from '@/services/api'

const state = {
  vehicles: [],
  currentVehicle: null,
  loading: false,
  error: null
}

const mutations = {
  SET_VEHICLES(state, vehicles) {
    state.vehicles = vehicles
  },
  SET_CURRENT_VEHICLE(state, vehicle) {
    state.currentVehicle = vehicle
  },
  ADD_VEHICLE(state, vehicle) {
    state.vehicles.push(vehicle)
  },
  UPDATE_VEHICLE(state, updatedVehicle) {
    const index = state.vehicles.findIndex(v => v.id === updatedVehicle.id)
    if (index !== -1) {
      Vue.set(state.vehicles, index, updatedVehicle)
    }
  },
  REMOVE_VEHICLE(state, vehicleId) {
    state.vehicles = state.vehicles.filter(v => v.id !== vehicleId)
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async fetchVehicles({ commit }) {
    commit('SET_LOADING', true)
    try {
      const response = await vehiclesAPI.getAll()
      commit('SET_VEHICLES', response.data)
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error fetching vehicles:', error)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchVehicle({ commit }, id) {
    commit('SET_LOADING', true)
    try {
      const response = await vehiclesAPI.getById(id)
      commit('SET_CURRENT_VEHICLE', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error fetching vehicle:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async createVehicle({ commit }, vehicleData) {
    commit('SET_LOADING', true)
    try {
      // Mapear datos del formulario a DTO del backend
      const createVehicleDto = {
        licensePlate: vehicleData.licensePlate,
        brand: vehicleData.brand || 'N/A',
        model: vehicleData.model,
        year: vehicleData.year,
        mileage: vehicleData.mileage,
        fleetId: vehicleData.fleetId || null,
        driverId: vehicleData.driverId || null
      }
      
      const response = await vehiclesAPI.create(createVehicleDto)
      commit('ADD_VEHICLE', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error creating vehicle:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async updateVehicle({ commit }, { id, vehicleData }) {
    commit('SET_LOADING', true)
    try {
      const updateVehicleDto = {
        licensePlate: vehicleData.licensePlate,
        brand: vehicleData.brand || 'N/A',
        model: vehicleData.model,
        year: vehicleData.year,
        mileage: vehicleData.mileage,
        fleetId: vehicleData.fleetId || null,
        driverId: vehicleData.driverId || null,
        status: vehicleData.status === 'active' ? 1 : vehicleData.status === 'warning' ? 2 : vehicleData.status === 'inactive' ? 3 : 4,
        lastServiceDate: vehicleData.lastServiceDate || null,
        nextServiceDate: vehicleData.nextServiceDate || null
      }
      
      const response = await vehiclesAPI.update(id, updateVehicleDto)
      commit('UPDATE_VEHICLE', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error updating vehicle:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async deleteVehicle({ commit }, id) {
    commit('SET_LOADING', true)
    try {
      await vehiclesAPI.delete(id)
      commit('REMOVE_VEHICLE', id)
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error deleting vehicle:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const getters = {
  activeVehicles: (state) => {
    return state.vehicles.filter(v => v.status === 1 || v.statusName === 'Active')
  },
  vehiclesByStatus: (state) => (status) => {
    return state.vehicles.filter(v => v.status === status || v.statusName === status)
  },
  vehicleCount: (state) => state.vehicles.length
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
