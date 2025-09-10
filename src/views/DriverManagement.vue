<template>
  <div>
    <Header title="Gestión de Conductores" />
    
    <!-- Acciones principales -->
    <div style="display: flex; justify-content: space-between; margin-bottom: 1.875rem;">
      <div>
        <button class="btn btn-primary" @click="openCreateModal">
          <i class="fas fa-plus" style="margin-right: 0.5rem;"></i> Nuevo Conductor
        </button>
        <button class="btn btn-secondary" style="margin-left: 0.5rem;" @click="refreshData">
          <i class="fas fa-redo-alt" style="margin-right: 0.5rem;"></i> Actualizar
        </button>
      </div>
      <div class="form-group" style="width: 300px; margin: 0;">
        <div style="position: relative;">
          <input 
            type="text" 
            class="form-control" 
            placeholder="Buscar conductor..." 
            style="padding-right: 35px;"
            v-model="searchQuery"
          >
          <i class="fas fa-search" style="position: absolute; right: 10px; top: 12px; color: #666;"></i>
        </div>
      </div>
    </div>

    <!-- Estadísticas de conductores -->
    <div class="dashboard-grid" style="margin-bottom: 1.875rem;" v-if="!statsLoading">
      <div class="stats-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div class="stats-label">Total Conductores</div>
            <div class="stats-value">{{ driverStats?.totalDrivers || 0 }}</div>
            <div style="color: var(--color-success); font-size: 0.875rem;">
              <i class="fas fa-users"></i> Registrados
            </div>
          </div>
          <div class="stats-icon">
            <i class="fas fa-users"></i>
          </div>
        </div>
      </div>

      <div class="stats-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div class="stats-label">Conductores Activos</div>
            <div class="stats-value">{{ driverStats?.activeDrivers || 0 }}</div>
            <div style="color: var(--color-success); font-size: 0.875rem;">
              <i class="fas fa-arrow-up"></i> {{ driverStats?.activePercentage || 0 }}% del total
            </div>
          </div>
          <div class="stats-icon">
            <i class="fas fa-user-check"></i>
          </div>
        </div>
      </div>

      <div class="stats-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div class="stats-label">Licencias por vencer</div>
            <div class="stats-value">{{ driverStats?.licensesExpiringSoon || 0 }}</div>
            <div style="color: var(--color-warning); font-size: 0.875rem;">
              <i class="fas fa-exclamation-triangle"></i> Próximos 30 días
            </div>
          </div>
          <div class="stats-icon">
            <i class="fas fa-id-card"></i>
          </div>
        </div>
      </div>

      <div class="stats-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div class="stats-label">Experiencia Promedio</div>
            <div class="stats-value">{{ driverStats?.averageExperience || 0 }}</div>
            <div style="color: var(--color-success); font-size: 0.875rem;">
              <i class="fas fa-clock"></i> años
            </div>
          </div>
          <div class="stats-icon">
            <i class="fas fa-road"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading para estadísticas -->
    <div v-if="statsLoading" class="dashboard-grid" style="margin-bottom: 1.875rem;">
      <div class="stats-card" v-for="n in 4" :key="n">
        <div style="text-align: center; padding: 1rem;">
          <i class="fas fa-spinner fa-spin" style="font-size: 1.5rem; color: var(--color-turquoise);"></i>
        </div>
      </div>
    </div>

    <!-- Estado de carga principal -->
    <div v-if="loading && drivers.length === 0" style="text-align: center; padding: 3rem;">
      <i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: var(--color-turquoise); margin-bottom: 1rem;"></i>
      <p>Cargando conductores...</p>
    </div>

    <!-- Estado de error -->
    <div v-else-if="error" style="text-align: center; padding: 3rem; background: #fee; border: 1px solid #fcc; border-radius: 8px; margin-bottom: 2rem;">
      <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--color-error); margin-bottom: 1rem;"></i>
      <h3 style="color: var(--color-error);">Error al cargar conductores</h3>
      <p>{{ error }}</p>
      <button class="btn btn-primary" @click="loadDrivers">
        <i class="fas fa-redo"></i> Reintentar
      </button>
    </div>

    <!-- Listado de conductores -->
    <div class="card" v-else>
      <div class="card-header">
        <h2 class="card-title">Conductores ({{ filteredDrivers.length }})</h2>
        <div>
          <button class="btn btn-secondary" @click="exportDrivers" :disabled="filteredDrivers.length === 0">
            <i class="fas fa-download" style="margin-right: 0.5rem;"></i> Exportar
          </button>
        </div>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre Completo</th>
            <th>Licencia</th>
            <th>Vencimiento</th>
            <th>Estado</th>
            <th>Vehículo</th>
            <th>Experiencia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="driver in paginatedDrivers" :key="driver.id">
            <td>
              <span style="font-family: monospace; background: var(--color-gray-light); padding: 0.25rem 0.5rem; border-radius: 4px;">
                {{ driver.code }}
              </span>
            </td>
            <td>
              <div>
                <div style="font-weight: 600;">{{ driver.fullName }}</div>
                <div style="font-size: 0.85rem; color: #666;">
                  <i class="fas fa-envelope"></i> {{ driver.email || 'Sin email' }}
                </div>
              </div>
            </td>
            <td>{{ driver.licenseNumber }}</td>
            <td>
              <span :style="{ color: driver.isLicenseExpiringSoon ? 'var(--color-error)' : 'var(--color-text)' }">
                {{ formatDate(driver.licenseExpiryDate) }}
              </span>
              <div v-if="driver.isLicenseExpiringSoon" style="font-size: 0.75rem; color: var(--color-error);">
                <i class="fas fa-exclamation-triangle"></i> Por vencer
              </div>
            </td>
            <td>
              <StatusBadge :status="getStatusKey(driver.status)" :text="driver.statusName" />
            </td>
            <td>{{ driver.assignedVehicle || 'No asignado' }}</td>
            <td>{{ driver.experienceYears }} años</td>
            <td>
              <div style="display: flex; gap: 0.25rem;">
                <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.813rem;" @click="viewDriver(driver)">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.813rem;" @click="editDriver(driver)">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" style="padding: 0.25rem 0.5rem; font-size: 0.813rem;" @click="confirmDelete(driver)">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Estado vacío -->
      <div v-if="filteredDrivers.length === 0 && !loading" style="text-align: center; padding: 3rem; color: #666;">
        <i class="fas fa-users" style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.3;"></i>
        <h3>No se encontraron conductores</h3>
        <p v-if="searchQuery">Intenta ajustar el término de búsqueda</p>
        <p v-else>Comienza agregando tu primer conductor</p>
        <button v-if="!searchQuery" class="btn btn-primary" @click="openCreateModal">
          <i class="fas fa-plus"></i> Agregar Conductor
        </button>
      </div>
      
      <!-- Paginación -->
      <Pagination 
        v-if="filteredDrivers.length > itemsPerPage"
        :current-page="currentPage"
        :total-items="filteredDrivers.length"
        :per-page="itemsPerPage"
        item-label="conductores"
        @page-change="changePage"
      />
    </div>

    <!-- Modal para nuevo/editar conductor -->
    <Modal 
      :show="showDriverModal" 
      :title="isEditing ? 'Editar Conductor' : 'Registrar nuevo conductor'"
      @close="closeDriverModal"
    >
      <DriverForm 
        :driver-data="editingDriver"
        :loading="actionLoading"
        @submit="saveDriver"
        @cancel="closeDriverModal"
      />
    </Modal>
    
    <!-- Modal para estadísticas del conductor -->
    <Modal 
      :show="showStatsModal" 
      title="Estadísticas del Conductor"
      @close="showStatsModal = false"
    >
      <div v-if="selectedDriver">
        <h3>{{ selectedDriver.fullName }}</h3>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
          <div style="background-color: var(--color-gray-light); padding: 1rem; border-radius: 4px; text-align: center;">
            <h4>Licencia</h4>
            <div style="font-size: 1.5rem; font-weight: bold; color: var(--color-turquoise);">{{ selectedDriver.licenseNumber }}</div>
            <div :style="{ color: selectedDriver.isLicenseExpiringSoon ? 'var(--color-error)' : 'var(--color-success)', fontSize: '0.875rem' }">
              <i :class="selectedDriver.isLicenseExpiringSoon ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle'"></i>
              {{ selectedDriver.isLicenseExpiringSoon ? 'Por vencer' : 'Vigente' }}
            </div>
          </div>
          <div style="background-color: var(--color-gray-light); padding: 1rem; border-radius: 4px; text-align: center;">
            <h4>Experiencia</h4>
            <div style="font-size: 1.5rem; font-weight: bold; color: var(--color-turquoise);">{{ selectedDriver.experienceYears }}</div>
            <div style="color: var(--color-success); font-size: 0.875rem;">
              <i class="fas fa-road"></i> años
            </div>
          </div>
        </div>
        
        <div style="background-color: var(--color-gray-light); padding: 1rem; border-radius: 4px;">
          <h4>Información de Contacto</h4>
          <p><strong>Email:</strong> {{ selectedDriver.email || 'No registrado' }}</p>
          <p><strong>Teléfono:</strong> {{ selectedDriver.phone || 'No registrado' }}</p>
          <p><strong>Vehículo asignado:</strong> {{ selectedDriver.assignedVehicle || 'Sin asignar' }}</p>
        </div>
      </div>
      
      <template #footer>
        <button class="btn btn-secondary" @click="showStatsModal = false">Cerrar</button>
        <button class="btn btn-primary" @click="editDriver(selectedDriver)">
          <i class="fas fa-edit" style="margin-right: 0.5rem;"></i> Editar Conductor
        </button>
      </template>
    </Modal>

    <!-- Componente de notificaciones -->
    <Notification ref="notification" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { Header, StatusBadge, Modal, Pagination, Notification } from '@/components/common'
import DriverForm from '@/components/drivers/DriverForm.vue'

export default {
  name: 'DriverManagement',
  components: {
    Header,
    StatusBadge,
    Modal,
    Pagination,
    DriverForm,
    Notification
  },
  data() {
    return {
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 10,
      showDriverModal: false,
      showStatsModal: false,
      editingDriver: {},
      selectedDriver: null,
      isEditing: false,
      statsLoading: false,
      actionLoading: false
    }
  },
  computed: {
    ...mapState('drivers', {
      drivers: 'drivers',
      driverStats: 'driverStats',
      loading: 'loading',
      error: 'error'
    }),
    
    filteredDrivers() {
      if (!this.searchQuery) {
        return this.drivers
      }
      
      const query = this.searchQuery.toLowerCase()
      return this.drivers.filter(driver => 
        (driver.fullName && driver.fullName.toLowerCase().includes(query)) ||
        (driver.firstName && driver.firstName.toLowerCase().includes(query)) ||
        (driver.lastName && driver.lastName.toLowerCase().includes(query)) ||
        (driver.code && driver.code.toLowerCase().includes(query)) ||
        (driver.licenseNumber && driver.licenseNumber.toLowerCase().includes(query)) ||
        (driver.email && driver.email.toLowerCase().includes(query))
      )
    },
    
    paginatedDrivers() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredDrivers.slice(start, end)
    }
  },
  methods: {
    ...mapActions('drivers', [
      'fetchDrivers',
      'fetchDriverStats',
      'createDriver',
      'updateDriver',
      'deleteDriver'
    ]),

    async loadDrivers() {
      try {
        this.statsLoading = true
        await Promise.all([
          this.fetchDrivers(),
          this.fetchDriverStats()
        ])
        this.statsLoading = false
      } catch (error) {
        this.statsLoading = false
        this.showNotification('Error al cargar los datos', 'error')
      }
    },

    async refreshData() {
      await this.loadDrivers()
      this.showNotification('Datos actualizados correctamente', 'success')
    },

    getStatusKey(status) {
      const statusMap = {
        1: 'active',
        2: 'inactive', 
        3: 'warning'
      }
      return statusMap[status] || 'inactive'
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    },

    openCreateModal() {
      this.editingDriver = {}
      this.isEditing = false
      this.showDriverModal = true
    },

    viewDriver(driver) {
      this.selectedDriver = driver
      this.showStatsModal = true
    },

    editDriver(driver) {
      this.editingDriver = { ...driver }
      this.isEditing = true
      this.showDriverModal = true
      this.showStatsModal = false
    },

    closeDriverModal() {
      this.showDriverModal = false
      this.editingDriver = {}
      this.isEditing = false
      this.actionLoading = false
    },

    async saveDriver(driverData) {
      this.actionLoading = true
      try {
        if (this.isEditing) {
          await this.updateDriver({ id: driverData.id, driverData })
          this.showNotification('Conductor actualizado correctamente', 'success')
        } else {
          await this.createDriver(driverData)
          this.showNotification('Conductor creado correctamente', 'success')
        }
        
        this.closeDriverModal()
        await this.fetchDriverStats() // Actualizar estadísticas
        
      } catch (error) {
        this.showNotification(error.message || 'Error al guardar el conductor', 'error')
      } finally {
        this.actionLoading = false
      }
    },

    confirmDelete(driver) {
      if (confirm(`¿Está seguro de eliminar al conductor ${driver.fullName}?`)) {
        this.handleDelete(driver.id)
      }
    },

    async handleDelete(driverId) {
      try {
        await this.deleteDriver(driverId)
        this.showNotification('Conductor eliminado correctamente', 'success')
        await this.fetchDriverStats() // Actualizar estadísticas
      } catch (error) {
        this.showNotification(error.message || 'Error al eliminar el conductor', 'error')
      }
    },

    changePage(page) {
      this.currentPage = page
    },

    exportDrivers() {
      try {
        const csvData = this.filteredDrivers.map(driver => ({
          Código: driver.code,
          'Nombre Completo': driver.fullName,
          Email: driver.email || '',
          Teléfono: driver.phone || '',
          'Número de Licencia': driver.licenseNumber,
          'Vencimiento Licencia': this.formatDate(driver.licenseExpiryDate),
          Estado: driver.statusName,
          'Vehículo Asignado': driver.assignedVehicle || 'Sin asignar',
          'Años de Experiencia': driver.experienceYears
        }))
        
        this.downloadCSV(csvData, 'conductores.csv')
        this.showNotification('Datos exportados correctamente', 'success')
      } catch (error) {
        this.showNotification('Error al exportar los datos', 'error')
      }
    },

    downloadCSV(data, filename) {
      if (!data.length) return
      
      const headers = Object.keys(data[0])
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => `"${row[header]}"`).join(',')
        )
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
      }
    },

    showNotification(message, type = 'info') {
      if (this.$refs.notification) {
        this.$refs.notification.addNotification(message, type)
      }
    }
  },

  async created() {
    await this.loadDrivers()
  },

  watch: {
    searchQuery() {
      this.currentPage = 1
    }
  }
}
</script>