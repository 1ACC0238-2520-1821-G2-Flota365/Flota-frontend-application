<template>
  <div>
    <Header title="Analytics AI" />
    
    <!-- Módulos de análisis inteligente -->
    <div style="margin-bottom: 1.875rem;">
      <h2>Análisis Predictivo con Inteligencia Artificial</h2>
      <p style="margin-bottom: 1.25rem;">Utilice nuestros modelos de inteligencia artificial para analizar el comportamiento de su flota, predecir mantenimientos y optimizar operaciones.</p>
      
      <div class="dashboard-grid">
        <div class="card" style="padding: 1.25rem;" v-for="(module, index) in analyticsModules" :key="index">
          <div style="display: flex; align-items: center; margin-bottom: 1rem;">
            <div style="width: 3rem; height: 3rem; border-radius: 50%; background-color: rgba(108, 218, 231, 0.1); display: flex; align-items: center; justify-content: center; margin-right: 1rem;">
              <i :class="['fas', module.icon]" style="font-size: 1.5rem; color: var(--color-turquoise);"></i>
            </div>
            <h3 style="margin: 0;">{{ module.title }}</h3>
          </div>
          <p>{{ module.description }}</p>
          <button class="btn btn-primary" style="width: 100%; margin-top: 0.5rem;" @click="startAnalysis(module)">
            Iniciar análisis
          </button>
        </div>
      </div>
    </div>

    <!-- Panel principal de análisis -->
    <div class="card" style="margin-bottom: 1.875rem;">
      <div class="card-header">
        <h2 class="card-title">Predicción de Fallos y Mantenimiento</h2>
        <div>
          <button class="btn btn-secondary">
            <i class="fas fa-cog" style="margin-right: 0.5rem;"></i> Configuración
          </button>
          <button class="btn btn-primary" style="margin-left: 0.5rem;" @click="runAnalysis">
            <i class="fas fa-play" style="margin-right: 0.5rem;"></i> Ejecutar Análisis
          </button>
        </div>
      </div>
      
      <!-- Controles del análisis -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.25rem; margin: 1.25rem 0;">
        <div class="form-group" style="margin: 0;" v-for="(control, index) in analysisControls" :key="index">
          <label :for="control.id" class="form-label">{{ control.label }}</label>
          <select :id="control.id" class="form-control" v-model="control.value">
            <option v-for="option in control.options" :key="option.value" :value="option.value" :selected="option.selected">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
      
      <!-- Resultados del análisis -->
      <div style="padding: 0 1.25rem 1.25rem 1.25rem;">
        <div v-if="!analysisRunning && !analysisResults" style="background-color: var(--color-gray-light); border-radius: 4px; padding: 1.25rem; text-align: center;">
          <p style="color: #666; margin-bottom: 0.5rem;">Seleccione los parámetros y haga clic en "Ejecutar Análisis" para obtener predicciones basadas en IA</p>
          <i class="fas fa-brain" style="font-size: 3rem; color: var(--color-turquoise); margin: 1rem 0;"></i>
          <p>Los resultados del análisis se mostrarán aquí</p>
        </div>

        <AnalysisProgress 
          v-if="analysisRunning" 
          :progress="progressWidth"
        />

        <div v-if="!analysisRunning && analysisResults" style="background-color: var(--color-gray-light); border-radius: 4px; padding: 1.25rem;">
          <h3 style="margin-top: 0;">Resultados del Análisis Predictivo</h3>
          
          <!-- Resultados visuales -->
          <div style="display: flex; gap: 1.25rem; margin: 1.25rem 0;">
            <div style="flex: 1; background-color: #fff; padding: 1rem; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
              <h4 style="margin-top: 0;">Vehículos con alta probabilidad de fallo</h4>
              <div style="height: 200px; background-color: #f0f0f0; border-radius: 4px; display: flex; flex-direction: column; justify-content: center; align-items: center; margin-bottom: 1rem;">
                <span style="font-size: 3rem; font-weight: bold; color: var(--color-error);">{{ analysisResults.vehicles.length }}</span>
                <span>vehículos requieren atención</span>
              </div>
              <ul style="padding-left: 1.25rem; margin: 0;">
                <li v-for="(vehicle, idx) in analysisResults.vehicles" :key="idx">
                  {{ vehicle.model }} ({{ vehicle.plate }}) - {{ vehicle.probability }}% probabilidad - {{ vehicle.system }}
                </li>
              </ul>
            </div>
            
            <div style="flex: 1; background-color: #fff; padding: 1rem; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
              <h4 style="margin-top: 0;">Gráfico de probabilidad de fallos</h4>
              <!-- Gráfico simulado -->
              <div style="height: 200px; display: flex; align-items: flex-end; gap: 15px; padding: 0.5rem 0;">
                <div v-for="(vehicle, idx) in analysisResults.vehicles.slice(0, 5)" :key="idx" style="flex: 1; display: flex; flex-direction: column; align-items: center;">
                  <div style="width: 30px; background-color: var(--color-error);" 
                       :style="{ height: (vehicle.probability * 1.8) + 'px' }"></div>
                  <span style="margin-top: 5px; font-size: 0.75rem;">{{ vehicle.plate }}</span>
                </div>
              </div>
              <p style="text-align: center; margin-top: 1rem; font-size: 0.875rem;">Probabilidad de fallo en los próximos 60 días</p>
            </div>
          </div>
          
          <!-- Recomendaciones -->
          <div style="background-color: #fff; padding: 1rem; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
            <h4 style="margin-top: 0;">Recomendaciones automáticas del sistema</h4>
            <ul style="padding-left: 1.25rem;">
              <li v-for="(recommendation, idx) in analysisResults.recommendations" :key="idx">
                {{ recommendation }}
              </li>
            </ul>
          </div>
          
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.25rem;">
            <button class="btn btn-secondary">
              <i class="fas fa-redo-alt" style="margin-right: 0.5rem;"></i> Recalibrar modelo
            </button>
            <button class="btn btn-primary">
              <i class="fas fa-download" style="margin-right: 0.5rem;"></i> Exportar resultados
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Análisis recientes -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Análisis Recientes</h2>
      </div>
      
      <div style="margin-top: 1.25rem;">
        <div v-for="(analysis, index) in recentAnalyses" :key="index" 
             style="border: 1px solid var(--color-gray-medium); border-radius: 4px; margin-bottom: 1.25rem;">
          <div style="padding: 1rem; background-color: var(--color-gray-light); border-bottom: 1px solid var(--color-gray-medium); display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0; font-size: 1.125rem;">{{ analysis.title }}</h3>
            <span style="color: #666; font-size: 0.875rem;">Generado: {{ analysis.date }}</span>
          </div>
          
          <div style="padding: 1rem;">
            <div style="display: flex; margin-bottom: 1rem;">
              <div style="flex: 1;">
                <h4 style="margin: 0 0 0.5rem 0; font-size: 1rem;">Parámetros utilizados</h4>
                <ul style="padding-left: 1.25rem; margin: 0;">
                  <li v-for="(param, idx) in analysis.parameters" :key="idx">{{ param }}</li>
                </ul>
              </div>
              
              <div style="flex: 1;">
                <h4 style="margin: 0 0 0.5rem 0; font-size: 1rem;">Resumen de resultados</h4>
                <p style="margin: 0;">{{ analysis.summary }}</p>
              </div>
            </div>
            
            <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
              <button class="btn btn-secondary">
                <i class="fas fa-chart-line" style="margin-right: 0.5rem;"></i> Ver detalles
              </button>
              <button class="btn btn-primary">
                <i class="fas fa-download" style="margin-right: 0.5rem;"></i> Descargar informe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Header } from '@/components/common'
import AnalysisProgress from '@/components/analytics/AnalysisProgress.vue'

export default {
  name: 'Analytics',
  components: {
    Header,
    AnalysisProgress
  },
  data() {
    return {
      // Datos mock mínimos para analytics
      analyticsModules: [
        {
          title: 'Predicción de Mantenimiento',
          description: 'Predice cuándo los vehículos necesitarán mantenimiento',
          icon: 'fa-wrench'
        },
        {
          title: 'Análisis de Comportamiento',
          description: 'Analiza patrones de conducción y comportamiento',
          icon: 'fa-chart-line'
        },
        {
          title: 'Optimización de Rutas',
          description: 'Optimiza rutas para maximizar eficiencia',
          icon: 'fa-route'
        },
        {
          title: 'Detección de Anomalías',
          description: 'Detecta comportamientos anómalos en tiempo real',
          icon: 'fa-exclamation-triangle'
        }
      ],
      recentAnalyses: [
        {
          title: 'Análisis de Mantenimiento Preventivo',
          date: '2025-01-15',
          parameters: [
            'Rango de datos: 12 meses',
            'Tipo de modelo: Predicción de fallos',
            'Nivel de confianza: 90%'
          ],
          summary: 'Se identificaron 4 vehículos con alta probabilidad de fallo en los próximos 60 días'
        }
      ],
      analysisControls: [
        {
          id: 'modelType',
          label: 'Modelo de IA',
          value: 'maintenance',
          options: [
            { value: 'maintenance', label: 'Predicción de mantenimiento' },
            { value: 'anomaly', label: 'Detección de anomalías' },
            { value: 'pattern', label: 'Análisis de patrones de fallos' },
            { value: 'correlation', label: 'Correlación de variables' }
          ]
        },
        {
          id: 'dataRange',
          label: 'Rango de datos históricos',
          value: '12',
          options: [
            { value: '3', label: '3 meses' },
            { value: '6', label: '6 meses' },
            { value: '12', label: '12 meses', selected: true },
            { value: '24', label: '24 meses' }
          ]
        },
        {
          id: 'predictionPeriod',
          label: 'Período de predicción',
          value: '60',
          options: [
            { value: '30', label: '30 días' },
            { value: '60', label: '60 días', selected: true },
            { value: '90', label: '90 días' },
            { value: '180', label: '180 días' }
          ]
        },
        {
          id: 'confidenceLevel',
          label: 'Nivel de confianza',
          value: '90',
          options: [
            { value: '80', label: '80%' },
            { value: '90', label: '90%', selected: true },
            { value: '95', label: '95%' },
            { value: '99', label: '99%' }
          ]
        }
      ],
      analysisRunning: false,
      progressWidth: 0,
      analysisResults: null
    }
  },
  methods: {
    startAnalysis(module) {
      alert(`Iniciando análisis de ${module.title}`)
    },
    runAnalysis() {
      this.analysisRunning = true
      this.progressWidth = 0
      this.analysisResults = null
      
      // Simulación de progreso
      setTimeout(() => {
        this.progressWidth = 100
      }, 100)
      
      // Simulación de resultados después de 3 segundos
      setTimeout(() => {
        this.analysisRunning = false
        this.analysisResults = {
          vehicles: [
            { model: 'Toyota Hilux', plate: 'ABC-123', probability: 87, system: 'Sistema de frenos' },
            { model: 'Ford Ranger', plate: 'XYZ-789', probability: 92, system: 'Sistema de transmisión' },
            { model: 'Nissan Frontier', plate: 'GHI-789', probability: 78, system: 'Sistema eléctrico' },
            { model: 'Toyota Hilux', plate: 'JKL-012', probability: 81, system: 'Sistema de suspensión' }
          ],
          recommendations: [
            'Programar mantenimiento preventivo para los 4 vehículos identificados',
            'Revisar historial de mantenimiento de la flota Ford Ranger (alta incidencia de problemas de transmisión)',
            'Implementar ciclo de inspección más frecuente para el sistema eléctrico de vehículos Nissan Frontier',
            'Actualizar programa de mantenimiento preventivo de los sistemas de suspensión'
          ]
        }
      }, 3000)
    }
  }
}
</script>