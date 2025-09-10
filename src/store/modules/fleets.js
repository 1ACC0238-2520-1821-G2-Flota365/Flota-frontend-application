import Vue from 'vue'
import { fleetsAPI } from '@/services/api'

const state = {
  fleets: [],
  currentFleet: null,
  loading: false,
  error: null
}

const mutations = {
  SET_FLEETS(state, fleets) {
    state.fleets = fleets
  },
  SET_CURRENT_FLEET(state, fleet) {
    state.currentFleet = fleet
  },
  ADD_FLEET(state, fleet) {
    state.fleets.push(fleet)
  },
  UPDATE_FLEET(state, updatedFleet) {
    const index = state.fleets.findIndex(f => f.id === updatedFleet.id)
    if (index !== -1) {
      Vue.set(state.fleets, index, updatedFleet)
    }
  },
  REMOVE_FLEET(state, fleetId) {
    state.fleets = state.fleets.filter(f => f.id !== fleetId)
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async fetchFleets({ commit }) {
    commit('SET_LOADING', true)
    try {
      const response = await fleetsAPI.getAll()
      commit('SET_FLEETS', response.data)
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error fetching fleets:', error)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async createFleet({ commit }, fleetData) {
    commit('SET_LOADING', true)
    try {
      const createFleetDto = {
        name: fleetData.name,
        description: fleetData.description || null,
        type: fleetData.type || 1 // Primary by default
      }
      
      const response = await fleetsAPI.create(createFleetDto)
      commit('ADD_FLEET', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error creating fleet:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async updateFleet({ commit }, { id, fleetData }) {
    commit('SET_LOADING', true)
    try {
      const updateFleetDto = {
        name: fleetData.name,
        description: fleetData.description || null,
        type: fleetData.type || 1,
        isActive: fleetData.isActive !== false
      }
      
      const response = await fleetsAPI.update(id, updateFleetDto)
      commit('UPDATE_FLEET', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error updating fleet:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}