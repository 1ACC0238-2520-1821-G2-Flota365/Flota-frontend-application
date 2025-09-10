<template>
  <div class="pagination-container">
    <div>
      <span>Mostrando {{ start }}-{{ end }} de {{ total }} {{ itemLabel }}</span>
    </div>
    <div>
      <button 
        class="btn btn-secondary" 
        :disabled="currentPage === 1"
        @click="$emit('page-change', currentPage - 1)"
      >
        Anterior
      </button>
      
      <button 
        v-for="page in displayedPages" 
        :key="page"
        :class="['btn', currentPage === page ? 'btn-primary' : 'btn-secondary']"
        style="margin-left: 0.5rem;"
        @click="$emit('page-change', page)"
      >
        {{ page }}
      </button>
      
      <button 
        class="btn btn-secondary" 
        style="margin-left: 0.5rem;"
        :disabled="currentPage === totalPages"
        @click="$emit('page-change', currentPage + 1)"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalItems: {
      type: Number,
      required: true
    },
    perPage: {
      type: Number,
      default: 5
    },
    itemLabel: {
      type: String,
      default: 'elementos'
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.perPage)
    },
    start() {
      return (this.currentPage - 1) * this.perPage + 1
    },
    end() {
      return Math.min(this.start + this.perPage - 1, this.totalItems)
    },
    total() {
      return this.totalItems
    },
    displayedPages() {
      // Show 3 pages around current page
      const pages = []
      const maxPagesToShow = 3
      
      let startPage = Math.max(1, this.currentPage - 1)
      let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1)
      
      if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1)
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
      
      return pages
    }
  }
}
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.25rem;
}
</style>