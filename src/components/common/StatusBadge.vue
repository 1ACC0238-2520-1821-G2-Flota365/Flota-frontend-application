<template>
  <span class="status" :class="statusClass">{{ text }}</span>
</template>

<script>
export default {
  name: 'StatusBadge',
  props: {
    status: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  },
  computed: {
    statusClass() {
      const statusMap = {
        active: 'status-active',
        inactive: 'status-inactive',
        warning: 'status-warning'
      }
      return statusMap[this.status.toLowerCase()] || 'status-inactive'
    }
  }
}
</script>