<template>
  <div>
    <Header title="Dashboard" />
    
    <!-- Estadísticas principales -->
    <div class="dashboard-grid">
      <div class="stats-card" v-for="(stat, index) in mainStats" :key="index">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div class="stats-label">{{ stat.label }}</div>
            <div class="stats-value">{{ stat.value }}</div>
            <div :style="{ color: stat.changeColor, fontSize: '0.875rem' }">
              <i :class="['fas', stat.changeIcon]"></i> {{ stat.changeText }}
            </div>
          </div>
          <div class="stats-icon">
            <i :class="['fas', stat.icon]"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Estadísticas secundarias -->
    <div class="dashboard-grid" style="margin-top: 1rem;">
      <div class="stats-card" v-for="(stat, index) in secondaryStats" :key="index">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div class="stats-label">{{ stat.label }}</div>
            <div class="stats-value">{{ stat.value }}</div>
            <div :style="{ color: stat.changeColor, fontSize: '0.875rem' }">
              <i :class="['fas', stat.changeIcon]"></i> {{ stat.changeText }}
            </div>
          </div>
          <div class="stats-icon">
            <i :class="['fas', stat.icon]"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid de dos columnas para contenido principal -->
    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.875rem; margin-top: 1.875rem;">
      
      <!-- Columna izquierda: Vehículos activos -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Vehículos activos</h2>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-secondary" @click="refreshActiveVehicles">
              <i class="fas fa-sync-alt"></i>
            </button>
            <button class="btn btn-primary" @click="exportActiveVehicles">
              <i class="fas fa-download" style="margin-right: 0.5rem;"></i> Exportar
            </button>
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="loadingVehicles" style="text-align: center; padding: 2rem;">
          <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--color-turquoise);"></i>
          <p>Cargando vehículos...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="errorVehicles" style="background-color: #fee; border: 1px solid #fcc; padding: 1rem; border-radius: 4px; margin-bottom: 1rem;">
          <p style="color: #c00; margin: 0;">
            <i class="fas fa-exclamation-triangle"></i> {{ errorVehicles }}
          </p>
          <button class="btn btn-secondary" style="margin-top: 0.5rem;" @click="loadActiveVehicles">
            <i class="fas fa-redo"></i> Reintentar
          </button>
        </div>

        <!-- Tabla de vehículos -->
        <div v-else style="overflow-x: auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Placa</th>
                <th>Modelo</th>
                <th>Conductor</th>
                <th>Estado</th>
                <th>Flota</th>
                <th>Última actualización</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="vehicle in activeVehicles" :key="vehicle.id">
                <td><strong>{{ vehicle.licensePlate }}</strong></td>
                <td>{{ vehicle.model || 'N/A' }}</td>
                <td>{{ vehicle.driverName || 'Sin asignar' }}</td>
                <td>
                  <span class="status-badge" 
                        :style="{ 
                          backgroundColor: vehicle.statusColor || '#28a745',
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem'
                        }">
                    {{ vehicle.statusName }}
                  </span>
                </td>
                <td>{{ vehicle.fleetName || 'Sin flota' }}</td>
                <td>{{ formatDateTime(vehicle.lastUpdate) }}</td>
              </tr>
            </tbody>
          </table>

          <!-- Estado vacío -->
          <div v-if="activeVehicles.length === 0" style="text-align: center; padding: 2rem; color: #666;">
            <i class="fas fa-car" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
            <p>No hay vehículos activos registrados</p>
            <button class="btn btn-primary" @click="$router.push('/vehicle-management')">
              Agregar primer vehículo
            </button>
          </div>
        </div>
      </div>

      <!-- Columna derecha: Resumen de flotas -->
      <div>
        <!-- Resumen de flotas -->
        <div class="card" style="margin-bottom: 1rem;">
          <div class="card-header">
            <h2 class="card-title">Resumen de flotas</h2>
          </div>

          <div v-if="loadingFleetSummary" style="text-align: center; padding: 1rem;">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Cargando...</p>
          </div>

          <div v-else-if="errorFleetSummary" style="background-color: #fee; border: 1px solid #fcc; padding: 1rem; border-radius: 4px;">
            <p style="color: #c00; margin: 0; font-size: 0.875rem;">
              <i class="fas fa-exclamation-triangle"></i> {{ errorFleetSummary }}
            </p>
          </div>

          <div v-else>
            <!-- Eficiencia general -->
            <div style="text-align: center; padding: 1rem; background-color: #f8f9fa; border-radius: 0.5rem; margin-bottom: 1rem;">
              <div style="font-size: 2rem; font-weight: bold; color: var(--color-turquoise);">
                {{ fleetSummary.overallEfficiency }}%
              </div>
              <div style="font-size: 0.875rem; color: #666;">Eficiencia general</div>
            </div>

            <!-- Desglose por tipo de flota -->
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <div v-if="fleetSummary.primaryFleetVehicles > 0" 
                   style="padding: 0.75rem; border: 1px solid #e0e0e0; border-radius: 0.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <div style="font-weight: bold;">Flota Principal</div>
                    <div style="font-size: 0.875rem; color: #666;">
                      {{ fleetSummary.primaryFleetVehicles }} vehículos
                    </div>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-weight: bold; color: var(--color-success);">
                      {{ fleetSummary.primaryFleetEfficiency }}%
                    </div>
                    <div style="font-size: 0.75rem; color: #666;">
                      {{ fleetSummary.primaryFleetTrend }}
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="fleetSummary.secondaryFleetVehicles > 0"
                   style="padding: 0.75rem; border: 1px solid #e0e0e0; border-radius: 0.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <div style="font-weight: bold;">Flota Secundaria</div>
                    <div style="font-size: 0.875rem; color: #666;">
                      {{ fleetSummary.secondaryFleetVehicles }} vehículos
                    </div>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-weight: bold; color: var(--color-warning);">
                      {{ fleetSummary.secondaryFleetEfficiency }}%
                    </div>
                    <div style="font-size: 0.75rem; color: #666;">
                      {{ fleetSummary.secondaryFleetTrend }}
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="fleetSummary.externalFleetVehicles > 0"
                   style="padding: 0.75rem; border: 1px solid #e0e0e0; border-radius: 0.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <div style="font-weight: bold;">Flota Externa</div>
                    <div style="font-size: 0.875rem; color: #666;">
                      {{ fleetSummary.externalFleetVehicles }} vehículos
                    </div>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-weight: bold; color: var(--color-info);">
                      {{ fleetSummary.externalFleetEfficiency }}%
                    </div>
                    <div style="font-size: 0.75rem; color: #666;">
                      {{ fleetSummary.externalFleetTrend }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Alertas críticas -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Alertas críticas</h2>
            <span v-if="dashboardStats" 
                  class="badge" 
                  :style="{ 
                    backgroundColor: dashboardStats.alertsCount > 0 ? 'var(--color-error)' : 'var(--color-success)',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '1rem',
                    fontSize: '0.75rem'
                  }">
              {{ dashboardStats.alertsCount }}
            </span>
          </div>

          <div v-if="dashboardStats && dashboardStats.alertsCount > 0">
            <!-- Vehículos que requieren servicio -->
            <div v-if="dashboardStats.vehiclesDueForService > 0" 
                 style="padding: 0.75rem; border-left: 4px solid var(--color-warning); background-color: rgba(255, 193, 7, 0.1); margin-bottom: 0.5rem;">
              <div style="display: flex; gap: 0.5rem; align-items: center;">
                <i class="fas fa-tools" style="color: var(--color-warning);"></i>
                <div>
                  <div style="font-weight: bold; font-size: 0.875rem;">Servicios pendientes</div>
                  <div style="font-size: 0.75rem; color: #666;">
                    {{ dashboardStats.vehiclesDueForService }} vehículo(s) requieren servicio
                  </div>
                </div>
              </div>
            </div>

            <!-- Vehículos en mantenimiento -->
            <div v-if="dashboardStats.vehiclesInMaintenance > 0"
                 style="padding: 0.75rem; border-left: 4px solid var(--color-error); background-color: rgba(220, 53, 69, 0.1); margin-bottom: 0.5rem;">
              <div style="display: flex; gap: 0.5rem; align-items: center;">
                <i class="fas fa-exclamation-triangle" style="color: var(--color-error);"></i>
                <div>
                  <div style="font-weight: bold; font-size: 0.875rem;">En mantenimiento</div>
                  <div style="font-size: 0.75rem; color: #666;">
                    {{ dashboardStats.vehiclesInMaintenance }} vehículo(s) fuera de servicio
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else style="text-align: center; padding: 1.5rem; color: #666;">
            <i class="fas fa-check-circle" style="font-size: 2rem; color: var(--color-success); margin-bottom: 0.5rem;"></i>
            <p style="margin: 0; font-size: 0.875rem;">Todo en orden</p>
            <p style="margin: 0; font-size: 0.75rem;">No hay alertas críticas</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para ver detalle de vehículo -->
    <Modal 
      :show="showVehicleModal" 
      title="Detalles del Vehículo"
      @close="showVehicleModal = false"
    >
      <div v-if="selectedVehicle">
        <div style="margin-bottom: 1rem;">
          <h3>{{ selectedVehicle.model }} ({{ selectedVehicle.licensePlate }})</h3>
          <span class="status-badge" 
                :style="{ 
                  backgroundColor: selectedVehicle.statusColor || '#28a745',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem'
                }">
            {{ selectedVehicle.statusName }}
          </span>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div>
            <p><strong>Conductor:</strong> {{ selectedVehicle.driverName || 'Sin asignar' }}</p>
            <p><strong>Flota:</strong> {{ selectedVehicle.fleetName || 'Sin flota' }}</p>
          </div>
          <div>
            <p><strong>Estado:</strong> {{ selectedVehicle.statusName }}</p>
            <p><strong>Última actualización:</strong> {{ formatDateTime(selectedVehicle.lastUpdate) }}</p>
          </div>
        </div>
      </div>
      
      <template #footer>
        <button class="btn btn-secondary" @click="showVehicleModal = false">Cerrar</button>
        <button class="btn btn-primary" @click="editSelectedVehicle">Editar</button>
      </template>
    </Modal>
  </div>
</template>

<script>
import { Header, Modal } from '@/components/common'
import { dashboardAPI } from '@/services/api'

export default {
  name: 'Dashboard',
  components: {
    Header,
    Modal
  },
  data() {
    return {
      dashboardStats: null,
      activeVehicles: [],
      fleetSummary: null,
      loadingStats: false,
      loadingVehicles: false,
      loadingFleetSummary: false,
      errorStats: null,
      errorVehicles: null,
      errorFleetSummary: null,
      showVehicleModal: false,
      selectedVehicle: null,
      lastRefresh: null
    }
  },
  computed: {
    mainStats() {
      if (!this.dashboardStats) {
        return [
          { label: 'Total de vehículos', value: '--', icon: 'fa-car', changeColor: '#666', changeIcon: 'fa-clock', changeText: 'Cargando...' },
          { label: 'Conductores activos', value: '--', icon: 'fa-id-card', changeColor: '#666', changeIcon: 'fa-clock', changeText: 'Cargando...' },
          { label: 'En mantenimiento', value: '--', icon: 'fa-tools', changeColor: '#666', changeIcon: 'fa-clock', changeText: 'Cargando...' },
          { label: 'Eficiencia de flota', value: '--%', icon: 'fa-chart-line', changeColor: '#666', changeIcon: 'fa-clock', changeText: 'Cargando...' }
        ]
      }

      return [
        {
          label: 'Total de vehículos',
          value: this.dashboardStats.totalVehicles,
          icon: 'fa-car',
          changeColor: this.getChangeColor(this.dashboardStats.totalVehiclesChange),
          changeIcon: this.getChangeIcon(this.dashboardStats.totalVehiclesChange),
          changeText: this.dashboardStats.totalVehiclesChange || 'Sin cambios'
        },
        {
          label: 'Conductores activos',
          value: this.dashboardStats.activeDrivers,
          icon: 'fa-id-card',
          changeColor: this.getChangeColor(this.dashboardStats.activeDriversChange),
          changeIcon: this.getChangeIcon(this.dashboardStats.activeDriversChange),
          changeText: this.dashboardStats.activeDriversChange || 'Sin cambios'
        },
        {
          label: 'En mantenimiento',
          value: this.dashboardStats.vehiclesInMaintenance,
          icon: 'fa-tools',
          changeColor: this.getChangeColor(this.dashboardStats.maintenanceChange),
          changeIcon: this.getChangeIcon(this.dashboardStats.maintenanceChange),
          changeText: this.dashboardStats.maintenanceChange || 'Sin cambios'
        },
        {
          label: 'Eficiencia de flota',
          value: `${this.dashboardStats.fleetEfficiency}%`,
          icon: 'fa-chart-line',
          changeColor: this.getChangeColor(this.dashboardStats.efficiencyChange),
          changeIcon: this.getChangeIcon(this.dashboardStats.efficiencyChange),
          changeText: this.dashboardStats.efficiencyChange || 'Sin cambios'
        }
      ]
    },

    secondaryStats() {
      if (!this.dashboardStats) {
        return [
          { label: 'Total de flotas', value: '--', icon: 'fa-layer-group', changeColor: '#666', changeIcon: 'fa-clock', changeText: 'Cargando...' },
          { label: 'Alertas activas', value: '--', icon: 'fa-bell', changeColor: '#666', changeIcon: 'fa-clock', changeText: 'Cargando...' },
          { label: 'Edad promedio', value: '--', icon: 'fa-calendar', changeColor: '#666', changeIcon: 'fa-clock', changeText: 'Cargando...' },
          { label: 'Servicios pendientes', value: '--', icon: 'fa-clipboard-list', changeColor: '#666', changeIcon: 'fa-clock', changeText: 'Cargando...' }
        ]
      }

      return [
        {
          label: 'Total de flotas',
          value: this.dashboardStats.totalFleets,
          icon: 'fa-layer-group',
          changeColor: 'var(--color-info)',
          changeIcon: 'fa-info-circle',
          changeText: 'Flotas registradas'
        },
        {
          label: 'Alertas activas',
          value: this.dashboardStats.alertsCount,
          icon: 'fa-bell',
          changeColor: this.dashboardStats.alertsCount > 0 ? 'var(--color-error)' : 'var(--color-success)',
          changeIcon: this.dashboardStats.alertsCount > 0 ? 'fa-exclamation-triangle' : 'fa-check-circle',
          changeText: this.dashboardStats.alertsCount > 0 ? 'Requieren atención' : 'Todo en orden'
        },
        {
          label: 'Edad promedio',
          value: `${this.dashboardStats.averageVehicleAge} años`,
          icon: 'fa-calendar',
          changeColor: 'var(--color-info)',
          changeIcon: 'fa-info-circle',
          changeText: 'Edad de vehículos'
        },
        {
          label: 'Servicios pendientes',
          value: this.dashboardStats.vehiclesDueForService,
          icon: 'fa-clipboard-list',
          changeColor: this.dashboardStats.vehiclesDueForService > 0 ? 'var(--color-warning)' : 'var(--color-success)',
          changeIcon: this.dashboardStats.vehiclesDueForService > 0 ? 'fa-exclamation-triangle' : 'fa-check-circle',
          changeText: this.dashboardStats.vehiclesDueForService > 0 ? 'Requieren servicio' : 'Al día'
        }
      ]
    }
  },
  methods: {
    async loadDashboardStats() {
      this.loadingStats = true
      this.errorStats = null
      
      try {
        const response = await dashboardAPI.getStats()
        this.dashboardStats = response.data
        this.lastRefresh = new Date()
      } catch (error) {
        console.error('Error loading dashboard stats:', error)
        this.errorStats = error.response?.data?.message || 'Error al cargar las estadísticas'
        this.$handleApiError(error, 'Error al cargar estadísticas del dashboard')
      } finally {
        this.loadingStats = false
      }
    },

    async loadActiveVehicles() {
      this.loadingVehicles = true
      this.errorVehicles = null
      
      try {
        const response = await dashboardAPI.getActiveVehicles()
        this.activeVehicles = response.data || []
      } catch (error) {
        console.error('Error loading active vehicles:', error)
        this.errorVehicles = error.response?.data?.message || 'Error al cargar los vehículos activos'
        this.$handleApiError(error, 'Error al cargar vehículos activos')
      } finally {
        this.loadingVehicles = false
      }
    },

    async loadFleetSummary() {
      this.loadingFleetSummary = true
      this.errorFleetSummary = null
      
      try {
        const response = await dashboardAPI.getFleetSummary()
        this.fleetSummary = response.data
      } catch (error) {
        console.error('Error loading fleet summary:', error)
        this.errorFleetSummary = error.response?.data?.message || 'Error al cargar el resumen de flotas'
        this.$handleApiError(error, 'Error al cargar resumen de flotas')
      } finally {
        this.loadingFleetSummary = false
      }
    },

    async refreshActiveVehicles() {
      await this.loadActiveVehicles()
      this.$notify('Vehículos actualizados', 'success')
    },

    async refreshAllData() {
      await Promise.all([
        this.loadDashboardStats(),
        this.loadActiveVehicles(),
        this.loadFleetSummary()
      ])
      this.$notify('Dashboard actualizado', 'success')
    },

    viewVehicle(vehicle) {
      this.selectedVehicle = vehicle
      this.showVehicleModal = true
    },

    editVehicle(vehicle) {
      const currentRoute = this.$route.path
      const targetRoute = '/vehicle-management'
      const targetQuery = { edit: vehicle.id }
      
      // Solo navegar si no estamos ya en la misma ruta con el mismo query
      if (currentRoute !== targetRoute || this.$route.query.edit != vehicle.id) {
        this.$router.push({ 
          path: targetRoute, 
          query: targetQuery 
        }).catch(err => {
          // Ignorar errores de navegación duplicada
          if (err.name !== 'NavigationDuplicated') {
            throw err
          }
        })
      }
    },

    editSelectedVehicle() {
      if (this.selectedVehicle) {
        this.editVehicle(this.selectedVehicle)
        this.showVehicleModal = false
      }
    },

    exportActiveVehicles() {
      if (this.activeVehicles.length === 0) {
        this.$notify('No hay datos para exportar', 'warning')
        return
      }

      const csvData = this.activeVehicles.map(v => ({
        Placa: v.licensePlate,
        Modelo: v.model || 'N/A',
        Conductor: v.driverName || 'Sin asignar',
        Estado: v.statusName,
        Flota: v.fleetName || 'Sin flota',
        'Última actualización': this.formatDateTime(v.lastUpdate)
      }))
      
      this.exportToCSV(csvData, `vehiculos_activos_${this.formatDateForFile(new Date())}.csv`)
    },

    exportToCSV(data, filename) {
      const headers = Object.keys(data[0])
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
      ].join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', filename)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        this.$notify('Archivo exportado correctamente', 'success')
      }
    },

    getChangeColor(changeText) {
      if (!changeText) return '#666'
      
      const text = changeText.toLowerCase()
      if (text.includes('↑') || text.includes('aumento') || text.includes('+')) {
        return 'var(--color-success)'
      } else if (text.includes('↓') || text.includes('disminución') || text.includes('-')) {
        return 'var(--color-error)'
      }
      return 'var(--color-info)'
    },

    getChangeIcon(changeText) {
      if (!changeText) return 'fa-minus'
      
      const text = changeText.toLowerCase()
      if (text.includes('↑') || text.includes('aumento') || text.includes('+')) {
        return 'fa-arrow-up'
      } else if (text.includes('↓') || text.includes('disminución') || text.includes('-')) {
        return 'fa-arrow-down'
      }
      return 'fa-equals'
    },

    formatDateTime(dateString) {
      if (!dateString) return 'N/A'
      
      const date = new Date(dateString)
      const now = new Date()
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
      
      if (diffInHours < 1) {
        return 'Hace menos de 1 hora'
      } else if (diffInHours < 24) {
        return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`
      } else {
        return date.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    },

    formatDateForFile(date) {
      return date.toISOString().split('T')[0]
    }
  },

  async created() {
    await this.refreshAllData()
  }
}
</script>

<style scoped>
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.stats-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.stats-label {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.stats-value {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.stats-icon {
  width: 3rem;
  height: 3rem;
  background-color: var(--color-turquoise);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.card-header {
  padding: 1.5rem 1.5rem 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 1.5rem 1.5rem 1.5rem;
  width: calc(100% - 3rem);
}

.data-table th,
.data-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.data-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.data-table tr:hover {
  background-color: #f8f9fa;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s;
}

.btn-primary {
  background-color: var(--color-turquoise);
  color: white;
}

.btn-primary:hover {
  background-color: #138496;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}
</style>