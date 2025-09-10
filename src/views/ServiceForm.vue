<template>
  <div>
    <Header :title="isEditing ? 'Editar Servicio' : 'Nuevo Servicio'" />

    <!-- Breadcrumb -->
    <div style="margin-bottom: 1.5rem;">
      <nav style="display: flex; align-items: center; gap: 0.5rem; color: #666; font-size: 0.9rem;">
        <router-link to="/fleet-management" style="color: var(--color-turquoise); text-decoration: none;">
          <i class="fas fa-arrow-left" style="margin-right: 0.5rem;"></i>
          Gestión de Flota
        </router-link>
        <span>/</span>
        <span>{{ isEditing ? 'Editar Servicio' : 'Nuevo Servicio' }}</span>
      </nav>
    </div>

    <!-- Formulario principal -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">
          <i class="fas fa-clipboard-list" style="margin-right: 0.5rem; color: var(--color-turquoise);"></i>
          {{ isEditing ? 'Editar Servicio' : 'Crear Nuevo Servicio' }}
        </h2>
        <div style="display: flex; gap: 0.75rem;">
          <button class="btn btn-secondary" @click="cancelForm">
            <i class="fas fa-times" style="margin-right: 0.5rem;"></i>
            Cancelar
          </button>
          <button class="btn btn-primary" @click="saveService" :disabled="!isFormValid">
            <i class="fas fa-save" style="margin-right: 0.5rem;"></i>
            {{ isEditing ? 'Actualizar' : 'Crear' }} Servicio
          </button>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" style="text-align: center; padding: 3rem;">
        <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--color-turquoise);"></i>
        <p>Cargando información...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" style="background-color: #fee; border: 1px solid #fcc; padding: 1rem; border-radius: 4px; margin: 1.5rem;">
        <p style="color: #c00; margin: 0;">
          <i class="fas fa-exclamation-triangle"></i> {{ error }}
        </p>
      </div>

      <!-- Formulario -->
      <form v-else @submit.prevent="saveService" style="padding: 2rem;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem;">
          
          <!-- Columna Izquierda - Información del Servicio -->
          <div>
            <div class="form-section">
              <h3 class="section-title">
                <i class="fas fa-info-circle"></i>
                Información del Servicio
              </h3>
              
              <div class="form-group">
                <label class="form-label">Código del Servicio</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="service.code"
                  readonly
                  style="background-color: #f8f9fa; font-weight: bold; font-size: 1.1rem;"
                >
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                  <label class="form-label">Fecha del Servicio *</label>
                  <input 
                    type="date" 
                    class="form-control" 
                    v-model="service.serviceDate"
                    required
                  >
                </div>
                <div class="form-group">
                  <label class="form-label">Hora de Salida *</label>
                  <input 
                    type="time" 
                    class="form-control" 
                    v-model="service.departureTime"
                    required
                  >
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Vehículo *</label>
                <div style="position: relative;">
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="vehicleSearchQuery"
                    @input="searchVehicles"
                    @focus="showVehicleSuggestions = true"
                    placeholder="Buscar por placa o modelo..."
                    required
                    autocomplete="off"
                  >
                  <div v-if="showVehicleSuggestions && vehicleSuggestions.length > 0" 
                       class="autocomplete-dropdown">
                    <div v-for="vehicle in vehicleSuggestions" 
                         :key="vehicle.id" 
                         class="autocomplete-item"
                         @click="selectVehicle(vehicle)">
                      <div style="font-weight: bold; color: var(--color-turquoise);">
                        {{ vehicle.licensePlate }}
                      </div>
                      <div style="font-size: 0.85rem; color: #666;">
                        {{ vehicle.brand }} {{ vehicle.model }} ({{ vehicle.year }})
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Conductor *</label>
                <div style="position: relative;">
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="driverSearchQuery"
                    @input="searchDrivers"
                    @focus="showDriverSuggestions = true"
                    placeholder="Buscar por nombre o licencia..."
                    required
                    autocomplete="off"
                  >
                  <div v-if="showDriverSuggestions && driverSuggestions.length > 0" 
                       class="autocomplete-dropdown">
                    <div v-for="driver in driverSuggestions" 
                         :key="driver.id" 
                         class="autocomplete-item"
                         @click="selectDriver(driver)">
                      <div style="font-weight: bold; color: var(--color-turquoise);">
                        {{ driver.fullName }}
                      </div>
                      <div style="font-size: 0.85rem; color: #666;">
                        Licencia: {{ driver.licenseNumber }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Observaciones</label>
                <textarea 
                  class="form-control" 
                  rows="4"
                  v-model="service.observations"
                  placeholder="Observaciones adicionales del servicio..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Columna Derecha - Ruta del Servicio -->
          <div>
            <div class="form-section">
              <h3 class="section-title">
                <i class="fas fa-route"></i>
                Ruta del Servicio
              </h3>

              <!-- Punto de Origen -->
              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-map-marker-alt" style="color: #28a745; margin-right: 0.5rem;"></i>
                  Punto de Origen *
                </label>
                <div class="origin-container">
                  <div style="margin-bottom: 0.5rem;">
                    <input 
                      type="text" 
                      class="form-control" 
                      v-model="service.origin.address"
                      placeholder="Dirección completa (Ej: Av. Los Frutales 344, Urb. Los Jardines)"
                      required
                    >
                  </div>
                  <div style="position: relative;">
                    <input 
                      type="text" 
                      class="form-control" 
                      v-model="service.origin.district"
                      @input="searchOriginDistricts"
                      @focus="showOriginSuggestions = true"
                      placeholder="Distrito de Lima..."
                      required
                      autocomplete="off"
                    >
                    <div v-if="showOriginSuggestions && originSuggestions.length > 0" 
                         class="autocomplete-dropdown">
                      <div v-for="district in originSuggestions" 
                           :key="district" 
                           class="autocomplete-item"
                           @click="selectOriginDistrict(district)">
                        {{ district }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Puntos de Destino -->
              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-flag-checkered" style="color: #dc3545; margin-right: 0.5rem;"></i>
                  Puntos de Destino * ({{ service.destinations.length }})
                </label>
                
                <div class="destinations-container">
                  <div v-for="(destination, index) in service.destinations" 
                       :key="index" 
                       class="destination-card">
                    <div class="destination-header">
                      <span class="destination-number">
                        <i class="fas fa-map-pin"></i>
                        Destino {{ index + 1 }}
                      </span>
                      <button 
                        type="button" 
                        class="btn btn-danger btn-sm" 
                        @click="removeDestination(index)"
                        :disabled="service.destinations.length === 1"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                    
                    <div style="margin-top: 0.75rem;">
                      <div style="margin-bottom: 0.5rem;">
                        <input 
                          type="text" 
                          class="form-control" 
                          v-model="service.destinations[index].address"
                          placeholder="Dirección completa del destino..."
                          required
                        >
                      </div>
                      <div style="position: relative;">
                        <input 
                          type="text" 
                          class="form-control" 
                          v-model="service.destinations[index].district"
                          @input="searchDestinationDistricts(index)"
                          @focus="activeDestinationIndex = index"
                          placeholder="Distrito de Lima..."
                          required
                          autocomplete="off"
                        >
                        <div v-if="activeDestinationIndex === index && destinationSuggestions.length > 0" 
                             class="autocomplete-dropdown">
                          <div v-for="district in destinationSuggestions" 
                               :key="district" 
                               class="autocomplete-item"
                               @click="selectDestinationDistrict(district, index)">
                            {{ district }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    type="button" 
                    class="btn btn-secondary add-destination-btn" 
                    @click="addDestination"
                  >
                    <i class="fas fa-plus" style="margin-right: 0.5rem;"></i> 
                    Agregar Nuevo Destino
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumen del servicio -->
        <div class="service-summary">
          <h3 style="margin-bottom: 1rem; color: var(--color-turquoise);">
            <i class="fas fa-clipboard-check" style="margin-right: 0.5rem;"></i>
            Resumen del Servicio
          </h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
            <div class="summary-item">
              <strong>Código:</strong> {{ service.code }}
            </div>
            <div class="summary-item">
              <strong>Fecha y Hora:</strong> {{ formatDate(service.serviceDate) }} a las {{ service.departureTime }}
            </div>
            <div class="summary-item">
              <strong>Vehículo:</strong> {{ vehicleSearchQuery || 'No seleccionado' }}
            </div>
            <div class="summary-item">
              <strong>Conductor:</strong> {{ driverSearchQuery || 'No seleccionado' }}
            </div>
            <div class="summary-item">
              <strong>Origen:</strong> {{ service.origin.district }} - {{ service.origin.address }}
            </div>
            <div class="summary-item">
              <strong>Destinos:</strong> {{ service.destinations.length }} punto(s)
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { Header } from '@/components/common'
import { driversAPI, vehiclesAPI, maintenanceAPI } from '@/services/api'

export default {
  name: 'ServiceForm',
  components: {
    Header
  },
  data() {
    return {
      loading: false,
      error: null,
      isEditing: false,
      
      service: {
        id: null,
        code: '',
        serviceDate: '',
        departureTime: '',
        vehicleId: '',
        driverId: '',
        origin: {
          address: '',
          district: ''
        },
        destinations: [{
          address: '',
          district: ''
        }],
        observations: '',
        status: 'pending'
      },
      
      // Datos para autocompletado
      vehicles: [],
      drivers: [],
      vehicleSearchQuery: '',
      driverSearchQuery: '',
      vehicleSuggestions: [],
      driverSuggestions: [],
      showVehicleSuggestions: false,
      showDriverSuggestions: false,
      
      // Distritos
      limaDistricts: [
        'Ancón', 'Ate', 'Barranco', 'Breña', 'Carabayllo', 'Chaclacayo', 'Chorrillos',
        'Cieneguilla', 'Comas', 'El Agustino', 'Independencia', 'Jesús María',
        'La Molina', 'La Victoria', 'Lima', 'Lince', 'Los Olivos', 'Lurigancho',
        'Lurín', 'Magdalena del Mar', 'Miraflores', 'Pachacámac', 'Pucusana',
        'Pueblo Libre', 'Puente Piedra', 'Punta Hermosa', 'Punta Negra',
        'Rímac', 'San Bartolo', 'San Borja', 'San Isidro', 'San Juan de Lurigancho',
        'San Juan de Miraflores', 'San Luis', 'San Martín de Porres', 'San Miguel',
        'Santa Anita', 'Santa María del Mar', 'Santa Rosa', 'Santiago de Surco',
        'Surquillo', 'Villa El Salvador', 'Villa María del Triunfo'
      ],
      originSuggestions: [],
      destinationSuggestions: [],
      showOriginSuggestions: false,
      activeDestinationIndex: -1,
      
      // Mock data - REMOVER cuando tengas los endpoints de Services
      mockVehicles: [],
      mockDrivers: []
    }
  },
  computed: {
    availableVehicles() {
      return Array.isArray(this.vehicles) ? this.vehicles.filter(v => v.status === 1) : []
    },
    
    availableDrivers() {
      return Array.isArray(this.drivers) ? this.drivers.filter(d => d.status === 1) : []
    },
    
    isFormValid() {
      return this.service.serviceDate && 
             this.service.departureTime && 
             this.service.vehicleId && 
             this.service.driverId && 
             this.service.origin.address && 
             this.service.origin.district &&
             this.service.destinations.length > 0 &&
             this.service.destinations.every(d => d.address && d.district)
    }
  },
  methods: {
    async loadData() {
      this.loading = true
      this.error = null
      
      try {
        // Cargar vehículos y conductores desde APIs reales
        const [vehiclesResponse, driversResponse] = await Promise.all([
          vehiclesAPI.getAll(),
          driversAPI.getAll()
        ])
        
        this.vehicles = vehiclesResponse.data
        this.drivers = driversResponse.data
        
        // Si es edición, cargar los datos del servicio
        if (this.$route.params.id) {
          await this.loadServiceData(this.$route.params.id)
        } else {
          await this.generateServiceCode()
        }
      } catch (error) {
        console.error('Error loading data:', error)
        this.error = 'Error al cargar los datos'
        this.$handleApiError(error, 'Error al cargar datos del formulario')
      } finally {
        this.loading = false
      }
    },
    
    async loadServiceData(serviceId) {
      try {
        const response = await maintenanceAPI.services.getById(serviceId)
        this.service = response.data
        this.isEditing = true
        
        // Cargar también los valores en los campos de búsqueda
        if (this.service.vehicleId) {
          const vehicle = this.vehicles.find(v => v.id == this.service.vehicleId)
          if (vehicle) {
            this.vehicleSearchQuery = `${vehicle.licensePlate} - ${vehicle.brand} ${vehicle.model}`
          }
        }
        
        if (this.service.driverId) {
          const driver = this.drivers.find(d => d.id == this.service.driverId)
          if (driver) {
            this.driverSearchQuery = `${driver.fullName} - ${driver.licenseNumber}`
          }
        }
      } catch (error) {
        console.error('Error loading service data:', error)
        this.error = 'Error al cargar los datos del servicio'
        this.$handleApiError(error, 'Error al cargar el servicio')
      }
    },
    
    async generateServiceCode() {
      try {
        // Generar código temporal (implementar endpoint getNextCode si existe)
        const response = { data: { code: `SV${Date.now().toString().slice(-6)}` } }
        this.service.code = response.data.code
      } catch (error) {
        console.error('Error generating service code:', error)
        // Fallback manual
        this.service.code = `P${String(Date.now()).slice(-5)}`
      }
    },
    
    searchVehicles() {
      if (this.vehicleSearchQuery.length > 0) {
        const query = this.vehicleSearchQuery.toLowerCase()
        this.vehicleSuggestions = this.availableVehicles.filter(vehicle =>
          vehicle.licensePlate.toLowerCase().includes(query) ||
          vehicle.brand.toLowerCase().includes(query) ||
          vehicle.model.toLowerCase().includes(query)
        ).slice(0, 5)
      } else {
        this.vehicleSuggestions = this.availableVehicles.slice(0, 5)
      }
    },
    
    searchDrivers() {
      if (this.driverSearchQuery.length > 0) {
        const query = this.driverSearchQuery.toLowerCase()
        this.driverSuggestions = this.availableDrivers.filter(driver =>
          driver.fullName.toLowerCase().includes(query) ||
          driver.licenseNumber.toLowerCase().includes(query)
        ).slice(0, 5)
      } else {
        this.driverSuggestions = this.availableDrivers.slice(0, 5)
      }
    },
    
    selectVehicle(vehicle) {
      this.service.vehicleId = vehicle.id
      this.vehicleSearchQuery = `${vehicle.licensePlate} - ${vehicle.brand} ${vehicle.model}`
      this.vehicleSuggestions = []
      this.showVehicleSuggestions = false
    },
    
    selectDriver(driver) {
      this.service.driverId = driver.id
      this.driverSearchQuery = `${driver.fullName} - ${driver.licenseNumber}`
      this.driverSuggestions = []
      this.showDriverSuggestions = false
    },
    
    searchOriginDistricts() {
      if (this.service.origin.district.length > 0) {
        this.originSuggestions = this.limaDistricts.filter(district =>
          district.toLowerCase().includes(this.service.origin.district.toLowerCase())
        ).slice(0, 5)
      } else {
        this.originSuggestions = []
      }
    },
    
    searchDestinationDistricts(index) {
      const query = this.service.destinations[index].district
      if (query && query.length > 0) {
        this.destinationSuggestions = this.limaDistricts.filter(district =>
          district.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5)
      } else {
        this.destinationSuggestions = []
      }
    },
    
    selectOriginDistrict(district) {
      this.service.origin.district = district
      this.originSuggestions = []
      this.showOriginSuggestions = false
    },
    
    selectDestinationDistrict(district, index) {
      this.service.destinations[index].district = district
      this.destinationSuggestions = []
      this.activeDestinationIndex = -1
    },
    
    addDestination() {
      this.service.destinations.push({
        address: '',
        district: ''
      })
    },
    
    removeDestination(index) {
      if (this.service.destinations.length > 1) {
        this.service.destinations.splice(index, 1)
      }
    },
    
    async saveService() {
      if (!this.isFormValid) return
      
      try {
        this.loading = true
        
        // Preparar datos para enviar al backend
        const serviceData = {
          code: this.service.code,
          serviceDate: this.service.serviceDate,
          departureTime: this.service.departureTime,
          vehicleId: this.service.vehicleId,
          driverId: this.service.driverId,
          origin: this.service.origin,
          destinations: this.service.destinations,
          observations: this.service.observations,
          status: this.service.status || 'pending'
        }
        
        if (this.isEditing) {
          // No hay endpoint update para services, usar create o implementar endpoint específico
          await maintenanceAPI.services.delete(this.service.id) // Eliminar anterior
          await maintenanceAPI.services.create(serviceData) // Crear nuevo
          this.$notify('Servicio actualizado correctamente', 'success')
        } else {
          await maintenanceAPI.services.create(serviceData)
          this.$notify('Servicio creado correctamente', 'success')
        }
        
        this.$router.push('/fleet-management')
      } catch (error) {
        console.error('Error saving service:', error)
        this.$handleApiError(error, `Error al ${this.isEditing ? 'actualizar' : 'crear'} el servicio`)
      } finally {
        this.loading = false
      }
    },
    
    cancelForm() {
      if (confirm('¿Está seguro que desea cancelar? Se perderán los cambios no guardados.')) {
        this.$router.push('/fleet-management')
      }
    },
    
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }
  },
  
  async created() {
    this.service.serviceDate = new Date().toISOString().split('T')[0]
    await this.loadData()
  },
  
  mounted() {
    // Ocultar sugerencias al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.form-group')) {
        this.vehicleSuggestions = []
        this.driverSuggestions = []
        this.originSuggestions = []
        this.destinationSuggestions = []
        this.showVehicleSuggestions = false
        this.showDriverSuggestions = false
        this.showOriginSuggestions = false
        this.activeDestinationIndex = -1
      }
    })
  }
}
</script>

<style scoped>
.form-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.section-title {
  margin: 0 0 1.5rem 0;
  color: var(--color-turquoise);
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 2px solid var(--color-turquoise);
  padding-bottom: 0.5rem;
}

.origin-container {
  padding: 1rem;
  border: 2px solid #28a745;
  border-radius: 8px;
  background-color: rgba(40, 167, 69, 0.05);
}

.destinations-container {
  max-height: 400px;
  overflow-y: auto;
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 1rem;
  background-color: #fafafa;
}

.destination-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.destination-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.destination-number {
  font-weight: bold;
  color: #dc3545;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.add-destination-btn {
  width: 100%;
  padding: 1rem;
  border: 2px dashed var(--color-turquoise);
  background-color: white;
  color: var(--color-turquoise);
  font-weight: 500;
}

.add-destination-btn:hover {
  background-color: var(--color-turquoise);
  color: white;
}

.service-summary {
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.summary-item {
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.autocomplete-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 4px 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.autocomplete-item {
  padding: 0.75rem;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.autocomplete-item:hover {
  background-color: #f8f9fa;
}

.autocomplete-item:last-child {
  border-bottom: none;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}
</style>