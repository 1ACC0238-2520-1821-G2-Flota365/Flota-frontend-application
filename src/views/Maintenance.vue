<template>
  <div>
    <Header title="Mantenimiento" />
    
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Sistema de Mantenimiento</h2>
      </div>
      
      <div style="padding: 2rem; text-align: center;">
        <i class="fas fa-tools" style="font-size: 4rem; color: var(--color-turquoise); margin-bottom: 1rem;"></i>
        <h3>Módulo de Mantenimiento</h3>
        <p>Esta página está en desarrollo. Próximamente tendrás acceso a:</p>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin: 2rem 0;">
          <div style="background-color: var(--color-gray-light); padding: 1.5rem; border-radius: 8px;">
            <i class="fas fa-calendar-alt" style="font-size: 2rem; color: var(--color-success); margin-bottom: 0.5rem;"></i>
            <h4>Programación</h4>
            <p>Programa mantenimientos preventivos y correctivos</p>
          </div>
          
          <div style="background-color: var(--color-gray-light); padding: 1.5rem; border-radius: 8px;">
            <i class="fas fa-history" style="font-size: 2rem; color: var(--color-warning); margin-bottom: 0.5rem;"></i>
            <h4>Historial</h4>
            <p>Consulta el historial completo de servicios</p>
          </div>
          
          <div style="background-color: var(--color-gray-light); padding: 1.5rem; border-radius: 8px;">
            <i class="fas fa-bell" style="font-size: 2rem; color: var(--color-error); margin-bottom: 0.5rem;"></i>
            <h4>Alertas</h4>
            <p>Recibe notificaciones de mantenimientos vencidos</p>
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
  name: 'Maintenance',
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