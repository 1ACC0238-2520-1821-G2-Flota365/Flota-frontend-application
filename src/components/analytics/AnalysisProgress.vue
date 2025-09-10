<template>
  <div class="analysis-progress-container">
    <p>{{ message || 'Procesando datos y ejecutando análisis...' }}</p>
    <div class="analysis-progress-bar">
      <div 
        class="analysis-progress-fill"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnalysisProgress',
  props: {
    progress: {
      type: Number,
      default: 0
    },
    message: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.analysis-progress-container {
  background-color: var(--color-gray-light);
  border-radius: 4px;
  padding: 1.25rem;
  text-align: center;
}

.analysis-progress-bar {
  width: 100%;
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  margin: 1rem 0;
  overflow: hidden;
}

.analysis-progress-fill {
  height: 100%;
  background-color: var(--color-turquoise);
  border-radius: 10px;
  transition: width 0.5s ease-in-out;
}
</style>