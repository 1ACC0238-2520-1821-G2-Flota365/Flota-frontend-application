<template>
  <div class="notification-container" v-if="notifications.length > 0">
    <div 
      v-for="(notification, index) in notifications" 
      :key="index"
      :class="['notification', `notification-${notification.type}`]"
    >
      <i :class="getIconClass(notification.type)"></i>
      <span>{{ notification.message }}</span>
      <button class="notification-close" @click="removeNotification(index)">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Notification',
  data() {
    return {
      notifications: []
    }
  },
  methods: {
    addNotification(message, type = 'info', duration = 5000) {
      const notification = { message, type }
      this.notifications.push(notification)
      
      if (duration > 0) {
        setTimeout(() => {
          this.removeNotification(this.notifications.indexOf(notification))
        }, duration)
      }
    },
    removeNotification(index) {
      if (index !== -1) {
        this.notifications.splice(index, 1)
      }
    },
    getIconClass(type) {
      const iconMap = {
        info: 'fas fa-info-circle',
        success: 'fas fa-check-circle',
        warning: 'fas fa-exclamation-triangle',
        error: 'fas fa-times-circle'
      }
      return iconMap[type] || iconMap.info
    }
  }
}
</script>