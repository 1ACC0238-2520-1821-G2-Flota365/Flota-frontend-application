<template>
  <div>
    <Header title="Reportes" />

    <!-- Filtros de reporte -->
    <div class="card" style="margin-bottom: 1.875rem;">
      <div class="card-header">
        <h2 class="card-title">Filtros de reporte</h2>
      </div>
      
      <form id="reportForm" @submit.prevent="generateReport">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; margin-bottom: 1.25rem;">
          <div class="form-group" style="margin: 0;">
            <label for="reportType" class="form-label">Tipo de reporte</label>
            <select id="reportType" class="form-control" v-model="reportFilters.type">
              <option value="performance">Rendimiento de flota</option>
              <option value="fuel">Consumo de combustible</option>
              <option value="maintenance">Mantenimiento</option>
              <option value="drivers">Desempeño de conductores</option>
              <option value="custom">Reporte personalizado</option>
            </select>
          </div>
          
          <div class="form-group" style="margin: 0;">
            <label for="dateRange" class="form-label">Rango de fechas</label>
            <select id="dateRange" class="form-control" v-model="reportFilters.dateRange">
              <option value="today">Hoy</option>
              <option value="week">Última semana</option>
              <option value="month" selected>Último mes</option>
              <option value="quarter">Último trimestre</option>
              <option value="year">Último año</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>
          
          <div class="form-group" style="margin: 0;">
            <label for="vehicles" class="form-label">Vehículos</label>
            <select id="vehicles" class="form-control" v-model="reportFilters.vehicles">
              <option value="all">Todos los vehículos</option>
              <option value="active">Vehículos activos</option>
              <option value="custom">Selección personalizada</option>
            </select>
          </div>
          
          <div class="form-group" style="margin: 0;">
            <label for="format" class="form-label">Formato de salida</label>
            <select id="format" class="form-control" v-model="reportFilters.format">
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>
        </div>
        
        <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
          <button type="reset" class="btn btn-secondary" @click="resetFilters">Limpiar filtros</button>
          <button type="submit" class="btn btn-primary">
            <i class="fas fa-file-alt" style="margin-right: 0.5rem;"></i> Generar reporte
          </button>
        </div>
      </form>
    </div>

    <!-- Reportes recientes -->
    <div class="card" style="margin-bottom: 1.875rem;">
      <div class="card-header">
        <h2 class="card-title">Reportes recientes</h2>
      </div>
      
      <table class="data-table">
        <thead>
          <tr>
            <th>Nombre del reporte</th>
            <th>Tipo</th>
            <th>Fecha de creación</th>
            <th>Creado por</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="report in mockReports" :key="report.id">
            <td>{{ report.name }}</td>
            <td>{{ report.type }}</td>
            <td>{{ report.date }}</td>
            <td>{{ report.author }}</td>
            <td>
              <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.813rem;" @click="downloadReport(report)">
                <i class="fas fa-download"></i>
              </button>
              <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.813rem;" @click="shareReport(report)">
                <i class="fas fa-share-alt"></i>
              </button>
              <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.813rem;" @click="deleteReport(report)">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Vista previa de reportes -->
    <div class="card" v-if="showReportPreview">
      <div class="card-header">
        <h2 class="card-title">Vista previa de reporte</h2>
        <div>
          <button class="btn btn-secondary">
            <i class="fas fa-print" style="margin-right: 0.5rem;"></i> Imprimir
          </button>
          <button class="btn btn-primary" style="margin-left: 0.5rem;">
            <i class="fas fa-download" style="margin-right: 0.5rem;"></i> Descargar
          </button>
        </div>
      </div>
      
      <!-- Vista previa del reporte seleccionado -->
      <div style="padding: 1.25rem; background-color: var(--color-gray-light); min-height: 400px; border-radius: 4px; margin-top: 0.75rem;">
        <!-- Cabecera del reporte -->
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <h2 style="margin-bottom: 0.5rem;">Reporte de Rendimiento de Flota</h2>
          <p>Período: 01/04/2025 - 30/04/2025</p>
          <p>Generado el: {{ new Date().toLocaleDateString('es-ES') }}</p>
        </div>
        
        <!-- Gráfico simulado -->
        <div style="background-color: #fff; padding: 1rem; border-radius: 4px; margin-bottom: 1.25rem;">
          <h3 style="margin-bottom: 0.75rem;">Rendimiento por vehículo</h3>
          <!-- Simulación de un gráfico de barras -->
          <div style="height: 200px; display: flex; align-items: flex-end; gap: 15px; padding: 10px 0;">
            <div v-for="(vehicle, index) in mockVehicles.slice(0, 5)" :key="index" style="flex: 1; display: flex; flex-direction: column; align-items: center;">
              <div style="width: 30px; background-color: var(--color-turquoise);" :style="{ height: (50 + Math.random() * 120) + 'px' }"></div>
              <span style="margin-top: 5px; font-size: 0.75rem;">{{ vehicle.plate }}</span>
            </div>
          </div>
        </div>
        
        <!-- Tabla de datos simulada -->
        <div style="background-color: #fff; padding: 1rem; border-radius: 4px;">
          <h3 style="margin-bottom: 0.75rem;">Datos detallados de rendimiento</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="text-align: left; padding: 0.5rem; border-bottom: 1px solid #ddd;">Vehículo</th>
                <th style="text-align: left; padding: 0.5rem; border-bottom: 1px solid #ddd;">Distancia (km)</th>
                <th style="text-align: left; padding: 0.5rem; border-bottom: 1px solid #ddd;">Combustible (L)</th>
                <th style="text-align: left; padding: 0.5rem; border-bottom: 1px solid #ddd;">Rendimiento (km/L)</th>
                <th style="text-align: left; padding: 0.5rem; border-bottom: 1px solid #ddd;">Costo Total ($)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(vehicle, index) in mockVehicles.slice(0, 5)" :key="index">
                <td style="padding: 0.5rem; border-bottom: 1px solid #eee;">{{ vehicle.model }} ({{ vehicle.plate }})</td>
                <td style="padding: 0.5rem; border-bottom: 1px solid #eee;">{{ Math.floor(800 + Math.random() * 700) }}</td>
                <td style="padding: 0.5rem; border-bottom: 1px solid #eee;">{{ Math.floor(80 + Math.random() * 70) }}</td>
                <td style="padding: 0.5rem; border-bottom: 1px solid #eee;">{{ (8 + Math.random() * 3).toFixed(2) }}</td>
                <td style="padding: 0.5rem; border-bottom: 1px solid #eee;">{{ Math.floor(400 + Math.random() * 300) }}.00</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td style="padding: 0.5rem; font-weight: bold;">Total / Promedio</td>
                <td style="padding: 0.5rem; font-weight: bold;">5,630</td>
                <td style="padding: 0.5rem; font-weight: bold;">593</td>
                <td style="padding: 0.5rem; font-weight: bold;">9.49</td>
                <td style="padding: 0.5rem; font-weight: bold;">2,965.00</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Header } from '@/components/common'

export default {
  name: 'Reporting',
  components: {
    Header
  },
  data() {
    return {
      // Datos mock mínimos para reportes
      mockReports: [
        { id: 1, name: 'Reporte_Rendimiento_Enero_2025.pdf', type: 'Rendimiento', date: '15/01/2025', author: 'Admin Sistema' },
        { id: 2, name: 'Reporte_Mantenimiento_Diciembre_2024.pdf', type: 'Mantenimiento', date: '02/01/2025', author: 'Admin Sistema' },
        { id: 3, name: 'Reporte_Conductores_Noviembre_2024.xlsx', type: 'Conductores', date: '28/12/2024', author: 'Admin Sistema' }
      ],
      mockVehicles: [
        { plate: 'ABC-123', model: 'Toyota Hilux' },
        { plate: 'XYZ-789', model: 'Ford Ranger' },
        { plate: 'GHI-456', model: 'Nissan Frontier' },
        { plate: 'JKL-012', model: 'Toyota Hilux' },
        { plate: 'MNO-345', model: 'Ford Transit' }
      ],
      reportFilters: {
        type: 'performance',
        dateRange: 'month',
        vehicles: 'all',
        format: 'pdf'
      },
      showReportPreview: false
    }
  },
  methods: {
    generateReport() {
      // Simulación de generación de reporte
      this.showReportPreview = true
      
      // Notificación
      alert('Reporte generado correctamente')
    },
    resetFilters() {
      this.reportFilters = {
        type: 'performance',
        dateRange: 'month',
        vehicles: 'all',
        format: 'pdf'
      }
    },
    downloadReport(report) {
      alert(`Descargando el reporte: ${report.name}`)
    },
    shareReport(report) {
      alert(`Compartiendo el reporte: ${report.name}`)
    },
    deleteReport(report) {
      if (confirm(`¿Está seguro de eliminar el reporte "${report.name}"?`)) {
        // Simulación de eliminación de reporte
        this.mockReports = this.mockReports.filter(r => r.id !== report.id)
      }
    }
  }
}
</script>