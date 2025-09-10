<template>
  <div>
    <Header title="Gestión de Flota" />

    <!-- Estadísticas de servicios -->
    <div class="dashboard-grid" style="margin-bottom: 1.875rem;">
      <div class="stats-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div class="stats-label">Servicios Pendientes</div>
            <div class="stats-value">{{ serviceStats.pending }}</div>
            <div style="font-size: 0.875rem; color: var(--color-warning);">
              <i class="fas fa-clock"></i> Por iniciar
            </div>
          </div>
          <div class="stats-icon">
            <i class="fas fa-clock"></i>
          </div>
        </div>
      </div>

      <div class="stats-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div class="stats-label">En Ruta</div>
            <div class="stats-value">{{ serviceStats.inRoute }}</div>
            <div style="font-size: 0.875rem; color: var(--color-turquoise);">
              <i class="fas fa-route"></i> En progreso
            </div>
          </div>
          <div class="stats-icon">
            <i class="fas fa-route"></i>
          </div>
        </div>
      </div>

      <div class="stats-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div class="stats-label">Completados Hoy</div>
            <div class="stats-value">{{ serviceStats.completedToday }}</div>
            <div style="font-size: 0.875rem; color: var(--color-success);">
              <i class="fas fa-check-circle"></i> Finalizados
            </div>
          </div>
          <div class="stats-icon">
            <i class="fas fa-check-circle"></i>
          </div>
        </div>
      </div>

      <div class="stats-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div class="stats-label">Total Servicios</div>
            <div class="stats-value">{{ serviceStats.total }}</div>
            <div style="font-size: 0.875rem; color: #666;">
              <i class="fas fa-list"></i> Este mes
            </div>
          </div>
          <div class="stats-icon">
            <i class="fas fa-list"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros y acciones principales -->
    <div class="card" style="margin-bottom: 1.875rem;">
      <div class="card-header">
        <h2 class="card-title">Servicios</h2>
        <button class="btn btn-primary" @click="$router.push('/service/new')">
          <i class="fas fa-plus" style="margin-right: 0.5rem;"></i> Nuevo Servicio
        </button>
      </div>

      <!-- Filtros -->
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; border-bottom: 1px solid #eee;">
        <div style="display: flex; gap: 1rem; align-items: center;">
          <div class="form-group" style="margin: 0; width: 300px;">
            <div style="position: relative;">
              <input 
                type="text" 
                class="form-control" 
                placeholder="Buscar por código, conductor, placa..." 
                style="padding-right: 35px;"
                v-model="searchQuery"
              >
              <i class="fas fa-search" style="position: absolute; right: 10px; top: 12px; color: #666;"></i>
            </div>
          </div>
          
          <div class="form-group" style="margin: 0;">
            <select class="form-control" v-model="statusFilter" style="width: 150px;">
              <option value="">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="in_route">En Ruta</option>
              <option value="completed">Completados</option>
              <option value="cancelled">Anulados</option>
            </select>
          </div>

          <div class="form-group" style="margin: 0;">
            <input 
              type="date" 
              class="form-control" 
              v-model="dateFilter"
              style="width: 150px;"
            >
          </div>
        </div>

        <div>
          <button class="btn btn-secondary" @click="clearFilters">
            <i class="fas fa-times" style="margin-right: 0.5rem;"></i> Limpiar
          </button>
          <button class="btn btn-secondary" style="margin-left: 0.5rem;" @click="exportServices">
            <i class="fas fa-download" style="margin-right: 0.5rem;"></i> Exportar
          </button>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" style="text-align: center; padding: 2rem;">
        <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--color-turquoise);"></i>
        <p>Cargando servicios...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" style="background-color: #fee; border: 1px solid #fcc; padding: 1rem; border-radius: 4px; margin: 1rem 1.5rem;">
        <p style="color: #c00; margin: 0;">
          <i class="fas fa-exclamation-triangle"></i> {{ error }}
        </p>
        <button class="btn btn-secondary" style="margin-top: 0.5rem;" @click="loadServices">
          <i class="fas fa-redo"></i> Reintentar
        </button>
      </div>

      <!-- Tabla de servicios -->
      <div v-else style="overflow-x: auto;">
        <table class="data-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Fecha Servicio</th>
              <th>Ruta</th>
              <th>Conductor</th>
              <th>Placa</th>
              <th>Hora Salida</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="service in paginatedServices" :key="service.id">
              <td><strong>{{ service.code }}</strong></td>
              <td>{{ formatDate(service.serviceDate) }}</td>
              <td>
                <div style="max-width: 300px;">
                  <div style="margin-bottom: 0.25rem;">
                    <strong style="color: var(--color-turquoise);">{{ service.origin.district }}</strong>
                  </div>
                  <div style="font-size: 0.85rem; color: #666; margin-bottom: 0.5rem;">
                    {{ service.origin.address }}
                  </div>
                  <div style="font-size: 0.85rem;">
                    <span style="color: #666;">→ </span>
                    <span v-for="(destination, index) in service.destinations.slice(0, 2)" :key="index">
                      <strong>{{ destination.district }}</strong><span v-if="index < service.destinations.slice(0, 2).length - 1">, </span>
                    </span>
                    <span v-if="service.destinations.length > 2" style="color: #666;">
                      (+{{ service.destinations.length - 2 }} más)
                    </span>
                  </div>
                </div>
              </td>
              <td>{{ service.driverName }}</td>
              <td>{{ service.vehiclePlate }}</td>
              <td>{{ service.departureTime }}</td>
              <td>
                <StatusBadge :status="service.status" :text="getStatusText(service.status)" />
              </td>
              <td>
                <button class="btn btn-secondary" 
                        style="padding: 0.25rem 0.5rem; font-size: 0.75rem; margin-right: 0.25rem;" 
                        @click="viewService(service)"
                        title="Ver detalle">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-secondary" 
                        style="padding: 0.25rem 0.5rem; font-size: 0.75rem; margin-right: 0.25rem;" 
                        @click="editService(service)"
                        :disabled="service.status === 'completed' || service.status === 'cancelled'"
                        title="Editar">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" 
                        style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" 
                        @click="confirmCancelService(service)"
                        :disabled="service.status === 'completed' || service.status === 'cancelled'"
                        title="Anular">
                  <i class="fas fa-ban"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Estado vacío -->
        <div v-if="filteredServices.length === 0" style="text-align: center; padding: 2rem; color: #666;">
          <i class="fas fa-clipboard-list" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
          <p>No hay servicios registrados</p>
          <button class="btn btn-primary" @click="$router.push('/service/new')">
            Crear primer servicio
          </button>
        </div>
      </div>

      <!-- Paginación -->
      <Pagination 
        v-if="filteredServices.length > 0"
        :current-page="currentPage"
        :total-items="filteredServices.length"
        :per-page="itemsPerPage"
        item-label="servicios"
        @page-change="currentPage = $event"
      />
    </div>

    <!-- Modal para ver detalle del servicio -->
    <Modal 
      :show="showDetailModal" 
      title="Detalle del Servicio"
      @close="showDetailModal = false"
    >
      <div v-if="selectedService">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
          <div>
            <h4 style="margin-bottom: 1rem; color: var(--color-turquoise);">Información General</h4>
            <p><strong>Código:</strong> {{ selectedService.code }}</p>
            <p><strong>Fecha de Servicio:</strong> {{ formatDate(selectedService.serviceDate) }}</p>
            <p><strong>Hora de Salida:</strong> {{ selectedService.departureTime }}</p>
            <p><strong>Estado:</strong> <StatusBadge :status="selectedService.status" :text="getStatusText(selectedService.status)" /></p>
            
            <h4 style="margin: 1.5rem 0 1rem 0; color: var(--color-turquoise);">Punto de Origen</h4>
            <div style="background-color: #f8f9fa; padding: 1rem; border-radius: 6px; border-left: 4px solid var(--color-turquoise);">
              <div style="font-weight: bold; color: var(--color-turquoise); margin-bottom: 0.5rem;">
                {{ selectedService.origin.district }}
              </div>
              <div style="color: #666;">
                {{ selectedService.origin.address }}
              </div>
            </div>
            
            <h4 style="margin: 1.5rem 0 1rem 0; color: var(--color-turquoise);">Destinos ({{ selectedService.destinations.length }})</h4>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <div v-for="(destination, index) in selectedService.destinations" 
                   :key="index"
                   style="background-color: #f8f9fa; padding: 1rem; border-radius: 6px; border-left: 4px solid #28a745;">
                <div style="font-weight: bold; color: #28a745; margin-bottom: 0.5rem;">
                  {{ index + 1 }}. {{ destination.district }}
                </div>
                <div style="color: #666;">
                  {{ destination.address }}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 style="margin-bottom: 1rem; color: var(--color-turquoise);">Asignación</h4>
            <p><strong>Conductor:</strong> {{ selectedService.driverName }}</p>
            <p><strong>Vehículo:</strong> {{ selectedService.vehiclePlate }} - {{ selectedService.vehicleModel }}</p>
            
            <h4 style="margin: 1.5rem 0 1rem 0; color: var(--color-turquoise);">Observaciones</h4>
            <p style="background-color: #f8f9fa; padding: 1rem; border-radius: 4px; min-height: 3rem;">
              {{ selectedService.observations || 'Sin observaciones' }}
            </p>
            
            <h4 style="margin: 1.5rem 0 1rem 0; color: var(--color-turquoise);">Fechas</h4>
            <p><strong>Creado:</strong> {{ formatDateTime(selectedService.createdAt) }}</p>
            <p v-if="selectedService.updatedAt"><strong>Última actualización:</strong> {{ formatDateTime(selectedService.updatedAt) }}</p>
          </div>
        </div>
      </div>
      
      <template #footer>
        <button class="btn btn-secondary" @click="showDetailModal = false">Cerrar</button>
        <button class="btn btn-primary" @click="$router.push(`/service/edit/${selectedService.id}`)" v-if="selectedService && selectedService.status !== 'completed' && selectedService.status !== 'cancelled'">
          Editar Servicio
        </button>
      </template>
    </Modal>

    <!-- Modal de confirmación para anular -->
    <Modal 
      :show="showCancelModal" 
      title="Confirmar Anulación"
      @close="showCancelModal = false"
    >
      <div v-if="serviceToCancel">
        <p>¿Está seguro que desea anular el servicio <strong>{{ serviceToCancel.code }}</strong>?</p>
        <p style="color: #666; font-size: 0.9rem;">
          Conductor: {{ serviceToCancel.driverName }}<br>
          Fecha: {{ formatDate(serviceToCancel.serviceDate) }} {{ serviceToCancel.departureTime }}
        </p>
        <div class="form-group">
          <label for="cancelReason" class="form-label">Motivo de anulación *</label>
          <textarea 
            id="cancelReason" 
            class="form-control" 
            rows="3"
            v-model="cancelReason"
            placeholder="Ingrese el motivo de la anulación..."
            required
          ></textarea>
        </div>
      </div>
      
      <template #footer>
        <button class="btn btn-secondary" @click="showCancelModal = false">Cancelar</button>
        <button class="btn btn-danger" @click="cancelService">
          Anular Servicio
        </button>
      </template>
    </Modal>
  </div>
</template>

<script>
import { Header, StatusBadge, Modal, Pagination } from '@/components/common'
import { maintenanceAPI } from '@/services/api'

export default {
  name: 'FleetManagement',
  components: {
    Header,
    StatusBadge,
    Modal,
    Pagination
  },
  data() {
    return {
      // Estados de carga
      loading: false,
      error: null,
      
      // Filtros
      searchQuery: '',
      statusFilter: '',
      dateFilter: '',
      currentPage: 1,
      itemsPerPage: 10,
      
      // Datos principales
      services: [],
      serviceStats: {
        pending: 0,
        inRoute: 0,
        completedToday: 0,
        total: 0
      },
      
      // Modales
      showDetailModal: false,
      showCancelModal: false,
      selectedService: null,
      serviceToCancel: null,
      cancelReason: '',
      
      // Mock services - REMOVER cuando tengas el endpoint de Services
      mockServices: [
        {
          id: 1,
          code: 'P04839',
          serviceDate: '2025-07-07',
          departureTime: '06:00',
          vehicleId: 1,
          vehiclePlate: 'ALP807',
          vehicleModel: 'Toyota Hiace',
          driverId: 1,
          driverName: 'Carlos Alberto Magno Torres',
          origin: {
            address: 'Av. Los Frutales 344',
            district: 'Ate'
          },
          destinations: [
            { address: 'Jr. Monterrey 123', district: 'Surquillo' },
            { address: 'Av. La Molina 456', district: 'La Molina' }
          ],
          observations: 'Servicio especial',
          status: 'pending',
          createdAt: '2025-07-06T10:00:00Z',
          updatedAt: '2025-07-06T10:00:00Z'
        },
        {
          id: 2,
          code: 'P04840',
          serviceDate: '2025-07-07',
          departureTime: '08:00',
          vehicleId: 2,
          vehiclePlate: 'ALP849',
          vehicleModel: 'Ford Transit',
          driverId: 2,
          driverName: 'David Valentín Cruzado Estrada',
          origin: {
            address: 'Av. Separadora Industrial 123',
            district: 'Ate'
          },
          destinations: [
            { address: 'Jr. Tomás Marsano 234', district: 'Surquillo' }
          ],
          observations: '',
          status: 'in_route',
          createdAt: '2025-07-06T09:00:00Z',
          updatedAt: '2025-07-07T08:00:00Z'
        }
      ]
    }
  },
  computed: {
    filteredServices() {
      let filtered = [...this.services]
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(service => 
          service.code.toLowerCase().includes(query) ||
          service.driverName.toLowerCase().includes(query) ||
          service.vehiclePlate.toLowerCase().includes(query) ||
          service.origin.district.toLowerCase().includes(query) ||
          service.origin.address.toLowerCase().includes(query) ||
          service.destinations.some(dest => 
            dest.district.toLowerCase().includes(query) || 
            dest.address.toLowerCase().includes(query)
          )
        )
      }
      
      if (this.statusFilter) {
        filtered = filtered.filter(service => service.status === this.statusFilter)
      }
      
      if (this.dateFilter) {
        filtered = filtered.filter(service => service.serviceDate === this.dateFilter)
      }
      
      return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    },
    
    paginatedServices() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredServices.slice(start, end)
    }
  },
  methods: {
    async loadServices() {
      this.loading = true
      this.error = null
      
      try {
        const response = await maintenanceAPI.services.getAll()
        this.services = response.data
        
        this.calculateStats()
        this.$notify('Servicios cargados correctamente', 'success')
      } catch (error) {
        console.error('Error loading services:', error)
        this.error = 'Error al cargar los servicios'
        
        // Fallback a datos mock si falla la API
        this.services = this.mockServices
        this.calculateStats()
        
        this.$handleApiError(error, 'Error al cargar servicios')
      } finally {
        this.loading = false
      }
    },
    
    calculateStats() {
      this.serviceStats = {
        pending: this.services.filter(s => s.status === 'pending').length,
        inRoute: this.services.filter(s => s.status === 'in_route').length,
        completedToday: this.services.filter(s => 
          s.status === 'completed' && 
          s.serviceDate === new Date().toISOString().split('T')[0]
        ).length,
        total: this.services.length
      }
    },
    
    getStatusText(status) {
      const statusMap = {
        pending: 'Pendiente',
        in_route: 'En Ruta',
        completed: 'Completado',
        cancelled: 'Anulado'
      }
      return statusMap[status] || status
    },
    
    viewService(service) {
      this.selectedService = service
      this.showDetailModal = true
    },
    
    editService(service) {
      this.$router.push(`/service/edit/${service.id}`)
    },
    
    confirmCancelService(service) {
      this.serviceToCancel = service
      this.cancelReason = ''
      this.showCancelModal = true
    },
    
    async cancelService() {
      if (!this.cancelReason.trim()) {
        this.$notify('Debe ingresar un motivo para la anulación', 'warning')
        return
      }
      
      try {
        await maintenanceAPI.services.delete(this.serviceToCancel.id)
        
        // Actualizar el servicio localmente
        const serviceIndex = this.services.findIndex(s => s.id === this.serviceToCancel.id)
        if (serviceIndex !== -1) {
          this.services[serviceIndex].status = 'cancelled'
          this.services[serviceIndex].statusName = 'Anulado'
        }
        
        this.showCancelModal = false
        this.calculateStats()
        this.$notify('Servicio anulado correctamente', 'success')
      } catch (error) {
        console.error('Error cancelling service:', error)
        this.$handleApiError(error, 'Error al anular el servicio')
      }
    },
    
    clearFilters() {
      this.searchQuery = ''
      this.statusFilter = ''
      this.dateFilter = ''
      this.currentPage = 1
    },
    
    exportServices() {
      if (this.filteredServices.length === 0) {
        this.$notify('No hay servicios para exportar', 'warning')
        return
      }
      
      const csvData = this.filteredServices.map(service => ({
        Código: service.code,
        'Fecha Servicio': this.formatDate(service.serviceDate),
        'Hora Salida': service.departureTime,
        Conductor: service.driverName,
        Placa: service.vehiclePlate,
        'Origen - Distrito': service.origin.district,
        'Origen - Dirección': service.origin.address,
        'Destinos': service.destinations.map((d, i) => `${i+1}. ${d.district} - ${d.address}`).join(' | '),
        Estado: this.getStatusText(service.status),
        Observaciones: service.observations || ''
      }))
      
      this.exportToCSV(csvData, `servicios_${new Date().toISOString().split('T')[0]}.csv`)
      this.$notify('Archivo exportado correctamente', 'success')
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
    },
    
    formatDateTime(dateString) {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  },
  
  async created() {
    await this.loadServices()
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

.btn-danger {
  background-color: #dc3545;
  color: white;
  border: none;
}

.btn-danger:hover {
  background-color: #c82333;
}

.btn-danger:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}
</style>