<template>
  <div>
    <Header title="Gestión de Vehículos" />

    <!-- Acciones principales -->
    <div style="display: flex; justify-content: space-between; margin-bottom: 1.875rem;">
      <div>
        <button class="btn btn-primary" @click="openNewVehicleModal">
          <i class="fas fa-plus" style="margin-right: 0.5rem;"></i> Nuevo Vehículo
        </button>
        <button class="btn btn-secondary" style="margin-left: 0.5rem;" @click="showFilters = !showFilters">
          <i class="fas fa-filter" style="margin-right: 0.5rem;"></i> Filtros
        </button>
      </div>
      <div class="form-group" style="width: 300px; margin: 0;">
        <div style="position: relative;">
          <input 
            type="text" 
            class="form-control" 
            placeholder="Buscar vehículo..." 
            style="padding-right: 35px;"
            v-model="searchQuery"
          >
          <i class="fas fa-search" style="position: absolute; right: 10px; top: 12px; color: #666;"></i>
        </div>
      </div>
    </div>

    <!-- Filtros (colapsable) -->
    <div class="card" v-if="showFilters" style="margin-bottom: 1.875rem; padding: 1rem;">
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem;">
        <div class="form-group" style="margin: 0;">
          <label for="statusFilter" class="form-label">Estado</label>
          <select id="statusFilter" class="form-control" v-model="filters.status">
            <option value="">Todos</option>
            <option value="1">Activos</option>
            <option value="2">En mantenimiento</option>
            <option value="3">Fuera de servicio</option>
            <option value="4">Dados de baja</option>
          </select>
        </div>
        
        <div class="form-group" style="margin: 0;">
          <label for="yearFilter" class="form-label">Año</label>
          <select id="yearFilter" class="form-control" v-model="filters.year">
            <option value="">Todos</option>
            <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
        
        <div class="form-group" style="margin: 0;">
          <label for="brandFilter" class="form-label">Marca</label>
          <select id="brandFilter" class="form-control" v-model="filters.brand">
            <option value="">Todas</option>
            <option v-for="brand in availableBrands" :key="brand" :value="brand">{{ brand }}</option>
          </select>
        </div>

        <div class="form-group" style="margin: 0;">
          <label for="fleetFilter" class="form-label">Flota</label>
          <select id="fleetFilter" class="form-control" v-model="filters.fleet">
            <option value="">Todas</option>
            <option v-for="fleet in fleets" :key="fleet.id" :value="fleet.id">{{ fleet.name }}</option>
          </select>
        </div>
      </div>
      
      <div style="display: flex; justify-content: flex-end; margin-top: 1rem;">
        <button class="btn btn-secondary" @click="resetFilters">Limpiar filtros</button>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="loading" style="text-align: center; padding: 2rem;">
      <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--color-turquoise);"></i>
      <p>Cargando vehículos...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" style="background-color: #fee; border: 1px solid #fcc; padding: 1rem; border-radius: 4px; margin-bottom: 1rem;">
      <p style="color: #c00; margin: 0;">
        <i class="fas fa-exclamation-triangle"></i> {{ error }}
      </p>
      <button class="btn btn-secondary" style="margin-top: 0.5rem;" @click="fetchVehicles">
        <i class="fas fa-redo"></i> Reintentar
      </button>
    </div>

    <!-- Listado de vehículos -->
    <div class="card" v-else>
      <div class="card-header">
        <h2 class="card-title">Listado de vehículos ({{ filteredVehicles.length }})</h2>
        <div>
          <button class="btn btn-secondary" @click="exportData" :disabled="filteredVehicles.length === 0">
            <i class="fas fa-download" style="margin-right: 0.5rem;"></i> Exportar
          </button>
          <button class="btn btn-secondary" style="margin-left: 0.5rem;" @click="fetchVehicles">
            <i class="fas fa-redo" style="margin-right: 0.5rem;"></i> Actualizar
          </button>
        </div>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th>Placa</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Año</th>
            <th>Kilometraje</th>
            <th>Estado</th>
            <th>Conductor</th>
            <th>Flota</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="vehicle in paginatedVehicles" :key="vehicle.id">
            <td>{{ vehicle.licensePlate }}</td>
            <td>{{ vehicle.brand }}</td>
            <td>{{ vehicle.model }}</td>
            <td>{{ vehicle.year }}</td>
            <td>{{ formatNumber(vehicle.mileage) }} km</td>
            <td>
              <StatusBadge :status="getStatusKey(vehicle.status)" :text="vehicle.statusName" />
            </td>
            <td>{{ vehicle.driverName || 'No asignado' }}</td>
            <td>{{ vehicle.fleetName || 'Sin flota' }}</td>
            <td>
              <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.813rem;" @click="viewVehicle(vehicle)">
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.813rem;" @click="editVehicle(vehicle)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.813rem;" @click="showHistory(vehicle)">
                <i class="fas fa-history"></i>
              </button>
              <button class="btn btn-danger" style="padding: 0.25rem 0.5rem; font-size: 0.813rem;" @click="deleteVehicle(vehicle)">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Estado vacío -->
      <div v-if="filteredVehicles.length === 0 && !loading" style="text-align: center; padding: 2rem; color: #666;">
        <i class="fas fa-car" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
        <p>No se encontraron vehículos</p>
      </div>
      
      <!-- Paginación -->
      <Pagination 
        v-if="filteredVehicles.length > 0"
        :current-page="currentPage"
        :total-items="filteredVehicles.length"
        :per-page="itemsPerPage"
        item-label="vehículos"
        @page-change="changePage"
      />
    </div>

    <!-- Modal para nuevo/editar vehículo -->
    <Modal 
      :show="showVehicleModal" 
      :title="editingVehicle.id ? 'Editar Vehículo' : 'Registrar nuevo vehículo'"
      @close="closeVehicleModal"
    >
      <VehicleForm 
        :vehicle-data="editingVehicle"
        :fleets="fleets"
        :drivers="drivers"
        :loading="vehicleActionLoading"
        @submit="saveVehicle"
        @cancel="closeVehicleModal"
      />
    </Modal>
    
    <!-- Modal para historial de vehículo -->
    <Modal 
      :show="showHistoryModal" 
      title="Historial del Vehículo"
      @close="showHistoryModal = false"
    >
      <div v-if="selectedVehicle">
        <h3>{{ selectedVehicle.licensePlate }} - {{ selectedVehicle.brand }} {{ selectedVehicle.model }}</h3>
        
        <div style="margin-top: 1rem;">
          <h4>Información general</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
            <div>
              <p><strong>Año:</strong> {{ selectedVehicle.year }}</p>
              <p><strong>Kilometraje actual:</strong> {{ formatNumber(selectedVehicle.mileage) }} km</p>
              <p><strong>Estado:</strong> {{ selectedVehicle.statusName }}</p>
            </div>
            <div>
              <p><strong>Conductor asignado:</strong> {{ selectedVehicle.driverName || 'No asignado' }}</p>
              <p><strong>Flota:</strong> {{ selectedVehicle.fleetName || 'Sin flota' }}</p>
              <p><strong>Último servicio:</strong> {{ formatDate(selectedVehicle.lastServiceDate) }}</p>
            </div>
          </div>
        </div>
        
        <div style="margin-top: 1rem;">
          <h4>Próximo mantenimiento</h4>
          <p v-if="selectedVehicle.nextServiceDate">
            <strong>Fecha programada:</strong> {{ formatDate(selectedVehicle.nextServiceDate) }}
          </p>
          <p v-else style="color: #999;">No hay mantenimiento programado</p>
        </div>
      </div>
      
      <template #footer>
        <button class="btn btn-secondary" @click="showHistoryModal = false">Cerrar</button>
        <button class="btn btn-primary" @click="viewMaintenanceHistory(selectedVehicle)">
          <i class="fas fa-wrench" style="margin-right: 0.5rem;"></i> Ver mantenimientos
        </button>
      </template>
    </Modal>

    <!-- Notification para mostrar mensajes -->
    <Notification ref="notification" />
  </div>
</template>

<script>
import { Header, StatusBadge, Modal, Pagination, Notification } from '@/components/common'
import VehicleForm from '@/components/vehicles/VehicleForm.vue'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'VehicleManagement',
  components: {
    Header,
    StatusBadge,
    Modal,
    Pagination,
    VehicleForm,
    Notification
  },
  data() {
    return {
      searchQuery: '',
      showFilters: false,
      filters: {
        status: '',
        year: '',
        brand: '',
        fleet: ''
      },
      currentPage: 1,
      itemsPerPage: 10,
      showVehicleModal: false,
      showHistoryModal: false,
      editingVehicle: {},
      selectedVehicle: null,
      vehicleActionLoading: false
    }
  },
  computed: {
    // Vehicles state
    ...mapState('vehicles', {
      vehicles: 'vehicles',
      loading: 'loading',
      error: 'error'
    }),
    // Fleets for dropdowns
    ...mapState('fleets', {
      fleets: 'fleets'
    }),
    // Drivers for dropdowns  
    ...mapState('drivers', {
      drivers: 'drivers'
    }),

    availableYears() {
      return [...new Set(this.vehicles.map(v => v.year))].sort((a, b) => b - a)
    },
    
    availableBrands() {
      return [...new Set(this.vehicles.map(v => v.brand).filter(Boolean))].sort()
    },
    
    filteredVehicles() {
      return this.vehicles.filter(vehicle => {
        // Search filter
        if (this.searchQuery) {
          const query = this.searchQuery.toLowerCase()
          if (!vehicle.licensePlate?.toLowerCase().includes(query) &&
              !vehicle.brand?.toLowerCase().includes(query) &&
              !vehicle.model?.toLowerCase().includes(query)) {
            return false
          }
        }
        
        // Status filter
        if (this.filters.status && vehicle.status !== parseInt(this.filters.status)) {
          return false
        }
        
        // Year filter
        if (this.filters.year && vehicle.year !== parseInt(this.filters.year)) {
          return false
        }
        
        // Brand filter
        if (this.filters.brand && vehicle.brand !== this.filters.brand) {
          return false
        }

        // Fleet filter
        if (this.filters.fleet && vehicle.fleetId !== parseInt(this.filters.fleet)) {
          return false
        }
        
        return true
      })
    },
    
    paginatedVehicles() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredVehicles.slice(start, end)
    }
  },
  methods: {
    // Vuex actions
    ...mapActions('vehicles', [
      'fetchVehicles',
      'createVehicle', 
      'updateVehicle',
      'deleteVehicle'
    ]),
    ...mapActions('fleets', ['fetchFleets']),
    ...mapActions('drivers', ['fetchDrivers']),

    getStatusKey(status) {
      const statusMap = {
        1: 'active',    // Active
        2: 'warning',   // InMaintenance  
        3: 'inactive',  // OutOfService
        4: 'inactive'   // Decommissioned
      }
      return statusMap[status] || 'inactive'
    },

    formatNumber(number) {
      if (!number) return '0'
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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

    openNewVehicleModal() {
      this.editingVehicle = {
        licensePlate: '',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        mileage: 0,
        fleetId: null,
        driverId: null
      }
      this.showVehicleModal = true
    },

    viewVehicle(vehicle) {
      this.selectedVehicle = vehicle
      this.editingVehicle = { ...vehicle }
      this.showVehicleModal = true
    },

    editVehicle(vehicle) {
      this.editingVehicle = { ...vehicle }
      this.showVehicleModal = true
    },

    showHistory(vehicle) {
      this.selectedVehicle = vehicle
      this.showHistoryModal = true
    },

    closeVehicleModal() {
      this.showVehicleModal = false
      this.editingVehicle = {}
    },

    async saveVehicle(vehicleData) {
      this.vehicleActionLoading = true
      try {
        if (vehicleData.id) {
          // Update existing vehicle
          await this.updateVehicle({ id: vehicleData.id, vehicleData })
          this.$refs.notification?.addNotification('Vehículo actualizado correctamente', 'success')
        } else {
          // Create new vehicle
          await this.createVehicle(vehicleData)
          this.$refs.notification?.addNotification('Vehículo creado correctamente', 'success')
        }
        
        this.closeVehicleModal()
      } catch (error) {
        this.$refs.notification?.addNotification(
          error.response?.data?.message || 'Error al guardar el vehículo', 
          'error'
        )
      } finally {
        this.vehicleActionLoading = false
      }
    },

    async deleteVehicle(vehicle) {
      if (confirm(`¿Está seguro de eliminar el vehículo ${vehicle.licensePlate}?`)) {
        try {
          await this.$store.dispatch('vehicles/deleteVehicle', vehicle.id)
          this.$refs.notification?.addNotification('Vehículo eliminado correctamente', 'success')
        } catch (error) {
          this.$refs.notification?.addNotification(
            error.response?.data?.message || 'Error al eliminar el vehículo', 
            'error'
          )
        }
      }
    },

    resetFilters() {
      this.filters = {
        status: '',
        year: '',
        brand: '',
        fleet: ''
      }
      this.searchQuery = ''
    },

    changePage(page) {
      this.currentPage = page
    },

    exportData() {
      const csvData = this.filteredVehicles.map(v => ({
        Placa: v.licensePlate,
        Marca: v.brand,
        Modelo: v.model,
        Año: v.year,
        Kilometraje: v.mileage,
        Estado: v.statusName,
        Conductor: v.driverName || 'No asignado',
        Flota: v.fleetName || 'Sin flota'
      }))
      
      const csv = this.convertToCSV(csvData)
      this.downloadCSV(csv, 'vehiculos.csv')
    },

    convertToCSV(data) {
      if (!data.length) return ''
      
      const headers = Object.keys(data[0])
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
      ].join('\n')
      
      return csvContent
    },

    downloadCSV(csv, filename) {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
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

    viewMaintenanceHistory(vehicle) {
      // Navegar a la página de mantenimiento con filtro del vehículo
      this.$router.push({ 
        path: '/maintenance', 
        query: { vehicle: vehicle.id } 
      })
    }
  },

  async created() {
    // Cargar datos necesarios
    await Promise.all([
      this.fetchVehicles(),
      this.fetchFleets(),
      this.fetchDrivers()
    ])

    // Check if we should open edit modal from another view
    const editId = parseInt(this.$route.query.edit)
    if (editId) {
      const vehicle = this.vehicles.find(v => v.id === editId)
      if (vehicle) {
        this.editVehicle(vehicle)
      }
    }
  },

  watch: {
    // Reset page when filters change
    filters: {
      handler() {
        this.currentPage = 1
      },
      deep: true
    },
    searchQuery() {
      this.currentPage = 1
    }
  }
}
</script>