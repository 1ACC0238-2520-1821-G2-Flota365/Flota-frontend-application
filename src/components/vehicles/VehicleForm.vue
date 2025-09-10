<template>
  <form @submit.prevent="handleSubmit" id="vehicleForm">
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
      <div class="form-group">
        <label for="plateNumber" class="form-label">Número de placa *</label>
        <input 
          type="text" 
          id="plateNumber" 
          class="form-control" 
          v-model="vehicle.licensePlate" 
          :disabled="loading"
          required
        >
        <small v-if="errors.licensePlate" style="color: var(--color-error);">{{ errors.licensePlate }}</small>
      </div>
      
      <div class="form-group">
        <label for="brand" class="form-label">Marca *</label>
        <input 
          type="text" 
          id="brand" 
          class="form-control" 
          v-model="vehicle.brand" 
          :disabled="loading"
          required
        >
        <small v-if="errors.brand" style="color: var(--color-error);">{{ errors.brand }}</small>
      </div>
      
      <div class="form-group">
        <label for="model" class="form-label">Modelo *</label>
        <input 
          type="text" 
          id="model" 
          class="form-control" 
          v-model="vehicle.model" 
          :disabled="loading"
          required
        >
        <small v-if="errors.model" style="color: var(--color-error);">{{ errors.model }}</small>
      </div>
      
      <div class="form-group">
        <label for="year" class="form-label">Año *</label>
        <input 
          type="number" 
          id="year" 
          class="form-control" 
          v-model.number="vehicle.year" 
          :min="1900" 
          :max="2030"
          :disabled="loading"
          required
        >
        <small v-if="errors.year" style="color: var(--color-error);">{{ errors.year }}</small>
      </div>
      
      <div class="form-group">
        <label for="mileage" class="form-label">Kilometraje *</label>
        <input 
          type="number" 
          id="mileage" 
          class="form-control" 
          v-model.number="vehicle.mileage" 
          min="0"
          :disabled="loading"
          required
        >
        <small v-if="errors.mileage" style="color: var(--color-error);">{{ errors.mileage }}</small>
      </div>
      
      <div class="form-group" v-if="isEdit">
        <label for="status" class="form-label">Estado</label>
        <select 
          id="status" 
          class="form-control" 
          v-model.number="vehicle.status"
          :disabled="loading"
        >
          <option :value="1">Activo</option>
          <option :value="2">En mantenimiento</option>
          <option :value="3">Fuera de servicio</option>
          <option :value="4">Dado de baja</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="fleet" class="form-label">Flota</label>
        <select 
          id="fleet" 
          class="form-control" 
          v-model.number="vehicle.fleetId"
          :disabled="loading"
        >
          <option :value="null">Sin flota asignada</option>
          <option 
            v-for="fleet in fleets" 
            :key="fleet.id" 
            :value="fleet.id"
          >
            {{ fleet.name }} ({{ fleet.typeName }})
          </option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="driver" class="form-label">Conductor asignado</label>
        <select 
          id="driver" 
          class="form-control" 
          v-model.number="vehicle.driverId"
          :disabled="loading"
        >
          <option :value="null">Sin conductor asignado</option>
          <option 
            v-for="driver in availableDrivers" 
            :key="driver.id" 
            :value="driver.id"
          >
            {{ driver.fullName || `${driver.firstName} ${driver.lastName}` }} 
            <span v-if="driver.licenseNumber">({{ driver.licenseNumber }})</span>
          </option>
        </select>
        <small v-if="selectedDriverInfo" style="color: #666;">
          Experiencia: {{ selectedDriverInfo.experienceYears }} años
          <span v-if="selectedDriverInfo.isLicenseExpiringSoon" style="color: var(--color-warning);">
            - ⚠️ Licencia por vencer
          </span>
        </small>
      </div>
    </div>

    <!-- Campos adicionales para edición -->
    <div v-if="isEdit" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-top: 1rem;">
      <div class="form-group">
        <label for="lastServiceDate" class="form-label">Fecha último servicio</label>
        <input 
          type="date" 
          id="lastServiceDate" 
          class="form-control" 
          v-model="vehicle.lastServiceDate"
          :disabled="loading"
        >
      </div>
      
      <div class="form-group">
        <label for="nextServiceDate" class="form-label">Fecha próximo servicio</label>
        <input 
          type="date" 
          id="nextServiceDate" 
          class="form-control" 
          v-model="vehicle.nextServiceDate"
          :disabled="loading"
        >
      </div>
    </div>
    
    <div class="form-group">
      <label for="notes" class="form-label">Notas adicionales</label>
      <textarea 
        id="notes" 
        class="form-control" 
        rows="3" 
        v-model="vehicle.notes"
        :disabled="loading"
        placeholder="Observaciones, características especiales, etc."
      ></textarea>
    </div>
    
    <!-- Información de validación -->
    <div v-if="Object.keys(errors).length > 0" style="background-color: #fee; border: 1px solid #fcc; padding: 1rem; border-radius: 4px; margin-top: 1rem;">
      <p style="color: #c00; margin: 0; font-weight: bold;">
        <i class="fas fa-exclamation-triangle"></i> Por favor corrija los siguientes errores:
      </p>
      <ul style="margin: 0.5rem 0 0 1.5rem; color: #c00;">
        <li v-for="(error, field) in errors" :key="field">{{ error }}</li>
      </ul>
    </div>
    
    <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.25rem;">
      <button 
        type="button" 
        class="btn btn-secondary" 
        @click="$emit('cancel')"
        :disabled="loading"
      >
        Cancelar
      </button>
      <button 
        type="submit" 
        class="btn btn-primary"
        :disabled="loading || !isFormValid"
      >
        <i v-if="loading" class="fas fa-spinner fa-spin" style="margin-right: 0.5rem;"></i>
        <i v-else :class="['fas', isEdit ? 'fa-save' : 'fa-plus']" style="margin-right: 0.5rem;"></i>
        {{ loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear') }} vehículo
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'VehicleForm',
  props: {
    vehicleData: {
      type: Object,
      default: () => ({
        licensePlate: '',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        mileage: 0,
        status: 1,
        fleetId: null,
        driverId: null,
        lastServiceDate: null,
        nextServiceDate: null,
        notes: ''
      })
    },
    fleets: {
      type: Array,
      default: () => []
    },
    drivers: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      vehicle: { ...this.vehicleData },
      errors: {}
    }
  },
  computed: {
    isEdit() {
      return !!this.vehicleData.id
    },
    
    availableDrivers() {
      // Solo mostrar conductores activos
      return this.drivers.filter(driver => {
        // Si estamos editando y el conductor ya está asignado a este vehículo, incluirlo
        if (this.isEdit && driver.id === this.vehicleData.driverId) {
          return true
        }
        // De lo contrario, solo mostrar conductores activos sin vehículo asignado
        return driver.status === 1 && !driver.assignedVehicle
      })
    },
    
    selectedDriverInfo() {
      if (!this.vehicle.driverId) return null
      return this.drivers.find(d => d.id === this.vehicle.driverId)
    },
    
    isFormValid() {
      return this.vehicle.licensePlate && 
             this.vehicle.brand && 
             this.vehicle.model && 
             this.vehicle.year && 
             this.vehicle.mileage !== null &&
             Object.keys(this.errors).length === 0
    }
  },
  methods: {
    validateForm() {
      this.errors = {}
      
      // Validar placa
      if (!this.vehicle.licensePlate) {
        this.errors.licensePlate = 'La placa es requerida'
      } else if (this.vehicle.licensePlate.length > 20) {
        this.errors.licensePlate = 'La placa no puede tener más de 20 caracteres'
      }
      
      // Validar marca
      if (!this.vehicle.brand) {
        this.errors.brand = 'La marca es requerida'
      } else if (this.vehicle.brand.length > 50) {
        this.errors.brand = 'La marca no puede tener más de 50 caracteres'
      }
      
      // Validar modelo
      if (!this.vehicle.model) {
        this.errors.model = 'El modelo es requerido'
      } else if (this.vehicle.model.length > 50) {
        this.errors.model = 'El modelo no puede tener más de 50 caracteres'
      }
      
      // Validar año
      if (!this.vehicle.year) {
        this.errors.year = 'El año es requerido'
      } else if (this.vehicle.year < 1900 || this.vehicle.year > 2030) {
        this.errors.year = 'El año debe estar entre 1900 y 2030'
      }
      
      // Validar kilometraje
      if (this.vehicle.mileage === null || this.vehicle.mileage === undefined) {
        this.errors.mileage = 'El kilometraje es requerido'
      } else if (this.vehicle.mileage < 0) {
        this.errors.mileage = 'El kilometraje no puede ser negativo'
      } else if (this.vehicle.mileage > 2147483647) {
        this.errors.mileage = 'El kilometraje es demasiado alto'
      }
      
      // Validar fechas de servicio
      if (this.vehicle.lastServiceDate && this.vehicle.nextServiceDate) {
        const lastService = new Date(this.vehicle.lastServiceDate)
        const nextService = new Date(this.vehicle.nextServiceDate)
        
        if (nextService <= lastService) {
          this.errors.nextServiceDate = 'La fecha del próximo servicio debe ser posterior al último servicio'
        }
      }
      
      return Object.keys(this.errors).length === 0
    },
    
    handleSubmit() {
      if (this.validateForm()) {
        // Preparar datos para enviar al backend
        const vehicleToSubmit = {
          ...this.vehicle,
          // Convertir valores null a undefined para que no se envíen al backend
          fleetId: this.vehicle.fleetId || undefined,
          driverId: this.vehicle.driverId || undefined,
          lastServiceDate: this.vehicle.lastServiceDate || undefined,
          nextServiceDate: this.vehicle.nextServiceDate || undefined
        }
        
        this.$emit('submit', vehicleToSubmit)
      }
    },
    
    // Formatear fechas para el input date
    formatDateForInput(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toISOString().split('T')[0]
    }
  },
  watch: {
    vehicleData: {
      handler(newValue) {
        this.vehicle = { 
          ...newValue,
          // Formatear fechas para los inputs
          lastServiceDate: this.formatDateForInput(newValue.lastServiceDate),
          nextServiceDate: this.formatDateForInput(newValue.nextServiceDate)
        }
        this.errors = {}
      },
      deep: true,
      immediate: true
    },
    
    // Validar en tiempo real
    'vehicle.licensePlate'() {
      if (this.errors.licensePlate) this.validateForm()
    },
    'vehicle.brand'() {
      if (this.errors.brand) this.validateForm()
    },
    'vehicle.model'() {
      if (this.errors.model) this.validateForm()
    },
    'vehicle.year'() {
      if (this.errors.year) this.validateForm()
    },
    'vehicle.mileage'() {
      if (this.errors.mileage) this.validateForm()
    },
    'vehicle.nextServiceDate'() {
      if (this.errors.nextServiceDate) this.validateForm()
    }
  }
}
</script>