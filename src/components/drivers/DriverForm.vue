<template>
  <div class="driver-form">
    <form @submit.prevent="handleSubmit" id="driverForm">
      <!-- Información personal -->
      <div class="form-section">
        <h3>Información Personal</h3>
        <div class="form-row">
          <div class="form-group">
            <label for="firstName" class="form-label required">Nombre *</label>
            <input 
              type="text" 
              id="firstName" 
              class="form-control" 
              :class="{ 'error': errors.firstName }"
              v-model="driver.firstName" 
              :disabled="loading"
              required
              maxlength="50"
            >
            <span v-if="errors.firstName" class="error-message">{{ errors.firstName }}</span>
          </div>
          
          <div class="form-group">
            <label for="lastName" class="form-label required">Apellidos *</label>
            <input 
              type="text" 
              id="lastName" 
              class="form-control" 
              :class="{ 'error': errors.lastName }"
              v-model="driver.lastName" 
              :disabled="loading"
              required
              maxlength="50"
            >
            <span v-if="errors.lastName" class="error-message">{{ errors.lastName }}</span>
          </div>
        </div>
      </div>

      <!-- Información de contacto -->
      <div class="form-section">
        <h3>Información de Contacto</h3>
        <div class="form-row">
          <div class="form-group">
            <label for="email" class="form-label">Correo electrónico</label>
            <input 
              type="email" 
              id="email" 
              class="form-control" 
              :class="{ 'error': errors.email }"
              v-model="driver.email" 
              :disabled="loading"
              maxlength="100"
              placeholder="ejemplo@correo.com"
            >
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>
          
          <div class="form-group">
            <label for="phone" class="form-label">Teléfono</label>
            <input 
              type="tel" 
              id="phone" 
              class="form-control" 
              :class="{ 'error': errors.phone }"
              v-model="driver.phone" 
              :disabled="loading"
              maxlength="20"
              placeholder="+51 999 123 456"
            >
            <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
          </div>
        </div>
      </div>

      <!-- Información de licencia -->
      <div class="form-section">
        <h3>Información de Licencia</h3>
        <div class="form-row">
          <div class="form-group">
            <label for="licenseNumber" class="form-label required">Número de licencia *</label>
            <input 
              type="text" 
              id="licenseNumber" 
              class="form-control" 
              :class="{ 'error': errors.licenseNumber }"
              v-model="driver.licenseNumber" 
              :disabled="loading"
              required
              maxlength="20"
              placeholder="Q12345678"
            >
            <span v-if="errors.licenseNumber" class="error-message">{{ errors.licenseNumber }}</span>
          </div>
          
          <div class="form-group">
            <label for="licenseExpiryDate" class="form-label required">Fecha de vencimiento *</label>
            <input 
              type="date" 
              id="licenseExpiryDate" 
              class="form-control" 
              :class="{ 'error': errors.licenseExpiryDate }"
              v-model="driver.licenseExpiryDate" 
              :disabled="loading"
              :min="todayDate"
              required
            >
            <span v-if="errors.licenseExpiryDate" class="error-message">{{ errors.licenseExpiryDate }}</span>
          </div>
        </div>
      </div>

      <!-- Experiencia y estado -->
      <div class="form-section">
        <h3>Experiencia</h3>
        <div class="form-row">
          <div class="form-group">
            <label for="experienceYears" class="form-label">Años de experiencia</label>
            <input 
              type="number" 
              id="experienceYears" 
              class="form-control" 
              :class="{ 'error': errors.experienceYears }"
              v-model.number="driver.experienceYears" 
              :disabled="loading"
              min="0"
              max="50"
              placeholder="0"
            >
            <span v-if="errors.experienceYears" class="error-message">{{ errors.experienceYears }}</span>
          </div>
          
          <div class="form-group" v-if="isEdit">
            <label for="status" class="form-label">Estado</label>
            <select 
              id="status" 
              class="form-control" 
              v-model.number="driver.status"
              :disabled="loading"
            >
              <option :value="1">Activo</option>
              <option :value="2">Inactivo</option>
              <option :value="3">En descanso</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="form-actions">
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
          <i v-else class="fas fa-save" style="margin-right: 0.5rem;"></i>
          {{ loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear') }} conductor
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'DriverForm',
  props: {
    driverData: {
      type: Object,
      default: () => ({})
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      driver: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        licenseNumber: '',
        licenseExpiryDate: '',
        experienceYears: 0,
        status: 1
      },
      errors: {}
    }
  },
  computed: {
    isEdit() {
      return !!(this.driverData && this.driverData.id)
    },
    
    todayDate() {
      return new Date().toISOString().split('T')[0]
    },
    
    isFormValid() {
      return this.driver.firstName && 
             this.driver.lastName && 
             this.driver.licenseNumber && 
             this.driver.licenseExpiryDate &&
             Object.keys(this.errors).length === 0
    }
  },
  watch: {
    driverData: {
      immediate: true,
      handler(newData) {
        if (newData && Object.keys(newData).length > 0) {
          this.loadDriverData(newData)
        } else {
          this.resetForm()
        }
      }
    },
    
    // Validación en tiempo real
    'driver.firstName'() { this.validateField('firstName') },
    'driver.lastName'() { this.validateField('lastName') },
    'driver.email'() { this.validateField('email') },
    'driver.phone'() { this.validateField('phone') },
    'driver.licenseNumber'() { this.validateField('licenseNumber') },
    'driver.licenseExpiryDate'() { this.validateField('licenseExpiryDate') },
    'driver.experienceYears'() { this.validateField('experienceYears') }
  },
  methods: {
    loadDriverData(data) {
      this.driver = {
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
        licenseNumber: data.licenseNumber || '',
        licenseExpiryDate: data.licenseExpiryDate ? data.licenseExpiryDate.split('T')[0] : '',
        experienceYears: data.experienceYears || 0,
        status: data.status || 1
      }
      this.errors = {}
    },
    
    resetForm() {
      this.driver = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        licenseNumber: '',
        licenseExpiryDate: '',
        experienceYears: 0,
        status: 1
      }
      this.errors = {}
    },
    
    validateField(fieldName) {
      switch (fieldName) {
        case 'firstName':
          if (!this.driver.firstName.trim()) {
            this.$set(this.errors, 'firstName', 'El nombre es requerido')
          } else if (this.driver.firstName.length < 2) {
            this.$set(this.errors, 'firstName', 'El nombre debe tener al menos 2 caracteres')
          } else {
            this.$delete(this.errors, 'firstName')
          }
          break
          
        case 'lastName':
          if (!this.driver.lastName.trim()) {
            this.$set(this.errors, 'lastName', 'El apellido es requerido')
          } else if (this.driver.lastName.length < 2) {
            this.$set(this.errors, 'lastName', 'El apellido debe tener al menos 2 caracteres')
          } else {
            this.$delete(this.errors, 'lastName')
          }
          break
          
        case 'email':
          if (this.driver.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(this.driver.email)) {
              this.$set(this.errors, 'email', 'Ingrese un correo electrónico válido')
            } else {
              this.$delete(this.errors, 'email')
            }
          } else {
            this.$delete(this.errors, 'email')
          }
          break
          
        case 'phone':
          if (this.driver.phone) {
            const phoneRegex = /^[+]?[0-9\s\-()]{9,}$/
            if (!phoneRegex.test(this.driver.phone)) {
              this.$set(this.errors, 'phone', 'Ingrese un número de teléfono válido')
            } else {
              this.$delete(this.errors, 'phone')
            }
          } else {
            this.$delete(this.errors, 'phone')
          }
          break
          
        case 'licenseNumber':
          if (!this.driver.licenseNumber.trim()) {
            this.$set(this.errors, 'licenseNumber', 'El número de licencia es requerido')
          } else if (this.driver.licenseNumber.length < 5) {
            this.$set(this.errors, 'licenseNumber', 'El número debe tener al menos 5 caracteres')
          } else {
            this.$delete(this.errors, 'licenseNumber')
          }
          break
          
        case 'licenseExpiryDate':
          if (!this.driver.licenseExpiryDate) {
            this.$set(this.errors, 'licenseExpiryDate', 'La fecha de vencimiento es requerida')
          } else {
            const expiryDate = new Date(this.driver.licenseExpiryDate)
            const today = new Date()
            if (expiryDate <= today) {
              this.$set(this.errors, 'licenseExpiryDate', 'La fecha debe ser futura')
            } else {
              this.$delete(this.errors, 'licenseExpiryDate')
            }
          }
          break
          
        case 'experienceYears':
          if (this.driver.experienceYears < 0) {
            this.$set(this.errors, 'experienceYears', 'No puede ser negativo')
          } else if (this.driver.experienceYears > 50) {
            this.$set(this.errors, 'experienceYears', 'Máximo 50 años')
          } else {
            this.$delete(this.errors, 'experienceYears')
          }
          break
      }
    },
    
    validateForm() {
      Object.keys(this.driver).forEach(field => {
        this.validateField(field)
      })
      return Object.keys(this.errors).length === 0
    },
    
    handleSubmit() {
      if (!this.validateForm()) {
        return
      }
      
      const submitData = { ...this.driver }
      
      if (this.isEdit) {
        submitData.id = this.driverData.id
      }
      
      this.$emit('submit', submitData)
    }
  }
}
</script>

<style scoped>
.driver-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid var(--color-gray-medium);
  border-radius: 8px;
  background-color: #fff;
}

.form-section h3 {
  margin: 0 0 1.5rem 0;
  color: var(--color-text);
  font-size: 1.125rem;
  font-weight: 600;
  border-bottom: 2px solid var(--color-turquoise);
  padding-bottom: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-text);
}

.form-label.required::after {
  content: '*';
  color: var(--color-error);
  margin-left: 0.25rem;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-gray-medium);
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: var(--color-turquoise);
  box-shadow: 0 0 0 2px rgba(108, 218, 231, 0.2);
}

.form-control.error {
  border-color: var(--color-error);
}

.form-control:disabled {
  background-color: var(--color-gray-light);
  cursor: not-allowed;
}

.error-message {
  display: block;
  color: var(--color-error);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-gray-medium);
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: var(--color-turquoise);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #4db5c4;
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: var(--color-gray-medium);
  color: var(--color-text);
}

.btn-secondary:hover:not(:disabled) {
  background-color: #c0c0c0;
}
</style>