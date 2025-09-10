<template>
  <div style="background-color: var(--color-gray-light); display: flex; justify-content: center; align-items: center; height: 100vh;">
    <div class="login-container">
      <div class="login-logo">
        <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 2rem;">
          <h1 style="color: var(--color-turquoise); margin: 0;">🚗 Flota365</h1>
        </div>
        <h2 style="text-align: center; margin: 1rem 0; color: var(--color-text);">Sistema de Gestión de Flotas</h2>
      </div>
      
      <!-- Error messages -->
      <div v-if="error" style="background-color: #fee; border: 1px solid #fcc; padding: 1rem; border-radius: 4px; margin-bottom: 1rem;">
        <p style="color: #c00; margin: 0;">
          <i class="fas fa-exclamation-triangle"></i> {{ error }}
        </p>
      </div>
      
      <form id="loginForm" @submit.prevent="login">
        <div class="form-group">
          <label for="email" class="form-label">Correo electrónico</label>
          <div style="position: relative;">
            <i class="fas fa-envelope" style="position: absolute; left: 10px; top: 12px; color: #666;"></i>
            <input 
              type="email" 
              id="email" 
              class="form-control" 
              placeholder="correo@empresa.com" 
              style="padding-left: 35px;" 
              v-model="credentials.email"
              :disabled="loading"
              required
            >
          </div>
        </div>
        
        <div class="form-group">
          <label for="password" class="form-label">Contraseña</label>
          <div style="position: relative;">
            <i class="fas fa-lock" style="position: absolute; left: 10px; top: 12px; color: #666;"></i>
            <input 
              type="password" 
              id="password" 
              class="form-control" 
              placeholder="Ingrese su contraseña" 
              style="padding-left: 35px;" 
              v-model="credentials.password"
              :disabled="loading"
              required
            >
          </div>
        </div>
        
        <div class="form-group" style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <input type="checkbox" id="remember" v-model="credentials.remember">
            <label for="remember">Recordarme</label>
          </div>
        </div>
        
        <div class="form-group">
          <button 
            type="submit" 
            class="btn btn-primary" 
            style="width: 100%;" 
            :disabled="loading"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin" style="margin-right: 0.5rem;"></i>
            <i v-else class="fas fa-sign-in-alt" style="margin-right: 0.5rem;"></i>
            {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </div>
      </form>

      <!-- Demo credentials info -->
      <div style="background-color: #e3f2fd; border: 1px solid #bbdefb; padding: 1rem; border-radius: 4px; margin-top: 1rem;">
        <p style="color: #1976d2; margin: 0; font-size: 0.875rem; text-align: center;">
          <i class="fas fa-info-circle"></i> 
          <strong>Modo desarrollo:</strong><br>
          Cualquier email y contraseña funcionarán
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 1.5rem; color: #666;">
        <p>© 2025 Flota365 - VSC-Visionaries</p>
        <p style="font-size: 0.813rem;">v1.0.0 - Sistema de Gestión de Flotas</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      credentials: {
        email: 'admin@flota365.com',
        password: 'admin123',
        remember: false
      }
    }
  },
  computed: {
    ...mapState('auth', {
      loading: 'loading',
      error: 'error'
    })
  },
  methods: {
    ...mapActions('auth', ['login']),
    
    async login() {
      try {
        await this.$store.dispatch('auth/login', this.credentials)
        
        // Redirect to dashboard on successful login
        this.$router.push('/')
        
        // Mostrar mensaje de bienvenida
        this.$notify('Bienvenido al sistema Flota365', 'success')
        
      } catch (error) {
        console.error('Error de login:', error)
        this.$notify('Error de autenticación', 'error')
      }
    }
  },
  
  mounted() {
    // Limpiar cualquier mensaje de error previo
    this.$store.commit('auth/SET_ERROR', null)
    
    // Si ya está autenticado, redirigir al dashboard
    if (this.$store.state.auth.isAuthenticated) {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.login-container {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}

.form-control:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>