import { dashboardAPI } from '@/services/api'

const state = {
  stats: null,
  activeVehicles: [],
  fleetSummary: null,
  loading: false,
  error: null
}

const mutations = {
  SET_STATS(state, stats) {
    state.stats = stats
  },
  SET_ACTIVE_VEHICLES(state, vehicles) {
    state.activeVehicles = vehicles
  },
  SET_FLEET_SUMMARY(state, summary) {
    state.fleetSummary = summary
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async fetchDashboardData({ commit }) {
    commit('SET_LOADING', true)
    try {
      const [statsResponse, vehiclesResponse, summaryResponse] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getActiveVehicles(),
        dashboardAPI.getFleetSummary()
      ])
      
      commit('SET_STATS', statsResponse.data)
      commit('SET_ACTIVE_VEHICLES', vehiclesResponse.data)
      commit('SET_FLEET_SUMMARY', summaryResponse.data)
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error fetching dashboard data:', error)
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const getters = {
  statCards: (state) => {
    if (!state.stats) return []
    
    return [
      {
        label: 'Total de vehículos',
        value: state.stats.totalVehicles,
        icon: 'fa-car',
        changeColor: 'var(--color-success)',
        changeIcon: 'fa-arrow-up',
        changeText: state.stats.totalVehiclesChange || '0% esta semana'
      },
      {
        label: 'Conductores activos',
        value: state.stats.activeDrivers,
        icon: 'fa-id-card',
        changeColor: 'var(--color-success)',
        changeIcon: 'fa-arrow-up',
        changeText: state.stats.activeDriversChange || '0% esta semana'
      },
      {
        label: 'En mantenimiento',
        value: state.stats.vehiclesInMaintenance,
        icon: 'fa-tools',
        changeColor: 'var(--color-warning)',
        changeIcon: 'fa-arrow-up',
        changeText: state.stats.maintenanceChange || '0% esta semana'
      },
      {
        label: 'Eficiencia de flota',
        value: `${state.stats.fleetEfficiency}%`,
        icon: 'fa-chart-line',
        changeColor: 'var(--color-success)',
        changeIcon: 'fa-arrow-up',
        changeText: state.stats.efficiencyChange || '0% este mes'
      }
    ]
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
