import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

// Filtros globales
Vue.filter('formatDate', function(value) {
  if (!value) return ''
  const date = new Date(value)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
})

Vue.filter('formatNumber', function(value) {
  if (!value) return '0'
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
})

// Mixin global para métodos comunes
Vue.mixin({
  methods: {
    // Usar tu sistema de notificaciones original
    $notify(message, type = 'info', duration = 5000) {
      // Buscar el componente App y usar su referencia a Notification
      let app = this.$root
      if (app.$children && app.$children[0] && app.$children[0].$refs.notification) {
        app.$children[0].$refs.notification.addNotification(message, type, duration)
      }
    },
    
    // Formatear estado de vehículos/conductores para usar con tu StatusBadge
    $getStatusClass(status) {
      const statusMap = {
        1: 'active',
        'active': 'active',
        2: 'warning', 
        'warning': 'warning',
        'inmaintenance': 'warning',
        3: 'inactive',
        'inactive': 'inactive',
        'outofservice': 'inactive',
        4: 'inactive',
        'decommissioned': 'inactive'
      }
      return statusMap[status?.toString().toLowerCase()] || 'inactive'
    },
    
    // Manejar errores de API de forma consistente
    $handleApiError(error, defaultMessage = 'Ha ocurrido un error') {
      console.error('API Error:', error)
      
      let message = defaultMessage
      
      if (error.response?.data?.message) {
        message = error.response.data.message
      } else if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors).flat()
        message = errors.join(', ')
      } else if (error.message) {
        message = error.message
      }
      
      this.$notify(message, 'error')
    }
  }
})

// Verificar autenticación al iniciar la aplicación
const token = localStorage.getItem('auth_token')
if (token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Date.now() / 1000
    
    if (payload.exp > currentTime) {
      store.commit('auth/SET_TOKEN', token)
    } else {
      localStorage.removeItem('auth_token')
    }
  } catch (error) {
    localStorage.removeItem('auth_token')
  }
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')