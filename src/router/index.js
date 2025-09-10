// router/index.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

// Componentes que SÍ existen
const Dashboard = () => import('@/views/Dashboard.vue')
const Login = () => import('@/views/Login.vue')
const DriverManagement = () => import('@/views/DriverManagement.vue')
const FleetManagement = () => import('@/views/FleetManagement.vue')
const Monitoring = () => import('@/views/Monitoring.vue')
const Reporting = () => import('@/views/Reporting.vue')
const Analytics = () => import('@/views/Analytics.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { 
      requiresAuth: false,
      title: 'Iniciar Sesión - Flota365'
    }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { 
      requiresAuth: true,
      title: 'Dashboard - Flota365'
    }
  },
  {
    path: '/driver-management',
    name: 'DriverManagement',
    component: DriverManagement,
    meta: { 
      requiresAuth: true,
      title: 'Gestión de Conductores - Flota365'
    }
  },
  {
    path: '/fleet-management',
    name: 'FleetManagement',
    component: FleetManagement,
    meta: { 
      requiresAuth: true,
      title: 'Gestión de Flotas - Flota365'
    }
  },
  {
    path: '/monitoring',
    name: 'Monitoring',
    component: Monitoring,
    meta: { 
      requiresAuth: true,
      title: 'Monitoreo en Tiempo Real - Flota365'
    }
  },
  {
    path: '/reporting',
    name: 'Reporting',
    component: Reporting,
    meta: { 
      requiresAuth: true,
      title: 'Reportes - Flota365'
    }
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: Analytics,
    meta: { 
      requiresAuth: true,
      title: 'Analytics AI - Flota365'
    }
  },
  // Ruta temporal para vehículos hasta que creemos el componente
  {
    path: '/vehicle-management',
    name: 'VehicleManagement',
    component: () => import('@/views/Dashboard.vue'), // Temporal, redirige al dashboard
    meta: { 
      requiresAuth: true,
      title: 'Gestión de Vehículos - Flota365'
    }
  },
  // NUEVAS RUTAS DE SERVICIOS
  {
    path: '/service/new',
    name: 'NewService',
    component: () => import('@/views/ServiceForm.vue'),
    meta: { 
      requiresAuth: true,
      title: 'Nuevo Servicio - Flota365'
    }
  },
  {
    path: '/service/edit/:id',
    name: 'EditService', 
    component: () => import('@/views/ServiceForm.vue'),
    meta: { 
      requiresAuth: true,
      title: 'Editar Servicio - Flota365'
    }
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

// Navigation guards
router.beforeEach((to, from, next) => {
  // Actualizar título de la página
  if (to.meta.title) {
    document.title = to.meta.title
  }

  const isAuthenticated = store.state.auth.isAuthenticated
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth !== false)

  // Si la ruta requiere autenticación y el usuario no está autenticado
  if (requiresAuth && !isAuthenticated) {
    // Guardar la ruta de destino para redirigir después del login
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
  // Si está autenticado y trata de acceder al login
  else if (to.path === '/login' && isAuthenticated) {
    next('/')
  }
  // En cualquier otro caso, continuar normalmente
  else {
    next()
  }
})

// After navigation hook para manejar errores de navegación
router.afterEach(() => {
  // Limpiar errores de navegación previos
  store.commit('CLEAR_ERROR')
  
  // Analytics/tracking si es necesario
  if (process.env.NODE_ENV === 'production') {
    // Aquí puedes agregar tracking analytics como Google Analytics
    // gtag('config', 'GA_MEASUREMENT_ID', { page_path: to.path })
  }
})

// Manejo de errores de navegación
router.onError((error) => {
  console.error('Router error:', error)
  
  // Manejar errores específicos
  if (error.name === 'ChunkLoadError') {
    // Error de carga de chunk - probablemente nueva versión de la app
    window.location.reload()
  }
})

export default router