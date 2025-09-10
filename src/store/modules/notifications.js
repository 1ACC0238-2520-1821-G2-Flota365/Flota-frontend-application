const state = {
  notifications: []
}

const mutations = {
  ADD_NOTIFICATION(state, notification) {
    const id = Date.now() + Math.random()
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      ...notification
    }
    
    state.notifications.push(newNotification)
    
    // Auto-remove notification after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        state.notifications = state.notifications.filter(n => n.id !== id)
      }, newNotification.duration)
    }
  },
  
  REMOVE_NOTIFICATION(state, notificationId) {
    state.notifications = state.notifications.filter(n => n.id !== notificationId)
  },
  
  CLEAR_NOTIFICATIONS(state) {
    state.notifications = []
  }
}

const actions = {
  showNotification({ commit }, notification) {
    commit('ADD_NOTIFICATION', notification)
  },
  
  removeNotification({ commit }, notificationId) {
    commit('REMOVE_NOTIFICATION', notificationId)
  },
  
  clearNotifications({ commit }) {
    commit('CLEAR_NOTIFICATIONS')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}