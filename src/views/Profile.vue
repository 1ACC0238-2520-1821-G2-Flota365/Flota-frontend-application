<template>
  <div>
    <Header title="Mi Perfil" />
    
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Perfil de Usuario</h2>
      </div>
      
      <div style="padding: 2rem; text-align: center;">
        <i class="fas fa-user-circle" style="font-size: 4rem; color: var(--color-turquoise); margin-bottom: 1rem;"></i>
        <h3>Gestión de Perfil</h3>
        <p>Esta página está en desarrollo. Próximamente podrás:</p>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin: 2rem 0;">
          <div style="background-color: var(--color-gray-light); padding: 1.5rem; border-radius: 8px;">
            <i class="fas fa-edit" style="font-size: 2rem; color: var(--color-success); margin-bottom: 0.5rem;"></i>
            <h4>Editar Datos</h4>
            <p>Actualiza tu información personal y de contacto</p>
          </div>
          
          <div style="background-color: var(--color-gray-light); padding: 1.5rem; border-radius: 8px;">
            <i class="fas fa-key" style="font-size: 2rem; color: var(--color-warning); margin-bottom: 0.5rem;"></i>
            <h4>Cambiar Contraseña</h4>
            <p>Modifica tu contraseña de acceso</p>
          </div>
          
          <div style="background-color: var(--color-gray-light); padding: 1.5rem; border-radius: 8px;">
            <i class="fas fa-cog" style="font-size: 2rem; color: var(--color-turquoise); margin-bottom: 0.5rem;"></i>
            <h4>Preferencias</h4>
            <p>Configura notificaciones y preferencias</p>
          </div>
        </div>
        
        <button class="btn btn-primary" @click="goBack">
          <i class="fas fa-arrow-left" style="margin-right: 0.5rem;"></i>
          Volver al Dashboard
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Header } from '@/components/common'

export default {
  name: 'Profile',
  components: {
    Header
  },
  methods: {
    goBack() {
      this.$router.push('/')
    }
  }
}
</script>