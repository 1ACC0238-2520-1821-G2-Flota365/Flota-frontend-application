<template>
  <div class="notifications-container">
    <transition-group name="notification" tag="div">
      <div 
        v-for="notification in notifications" 
        :key="notification.id"
        :class="['notification', `notification-${notification.type}`]"
        @click="removeNotification(notification.id)"
      >
        <div class="notification-content">
          <i :class="getIconClass(notification.type)" class="notification-icon"></i>
          <div class="notification-text">
            <div class="notification-message">{{ notification.message }}</div>
          </div>
          <button 
            class="notification-close" 
            @click.stop="removeNotification(notification.id)"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'GlobalNotifications',
  computed: {
    ...mapState('notifications', ['notifications'])
  },
  methods: {
    ...mapActions('notifications', ['removeNotification']),
    
    getIconClass(type) {
      const iconMap = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
      }
      return iconMap[type] || iconMap.info
    }
  }
}
</script>

<style scoped>
.notifications-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  max-width: 400px;
  width: 100%;
}

.notification {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 12px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.notification:hover {
  transform: translateX(-5px);
}

.notification-content {
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.notification-icon {
  font-size: 20px;
  margin-top: 2px;
  flex-shrink: 0;
}

.notification-text {
  flex: 1;
  min-width: 0;
}

.notification-message {
  font-weight: 500;
  line-height: 1.4;
}

.notification-close {
  background: none;
  border: none;
  font-size: 14px;
  color: #999;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.notification-close:hover {
  background-color: rgba(0, 0, 0, 0.1);
  color: #666;
}

/* Notification types */
.notification-success {
  border-left: 4px solid #10b981;
}

.notification-success .notification-icon {
  color: #10b981;
}

.notification-error {
  border-left: 4px solid #ef4444;
}

.notification-error .notification-icon {
  color: #ef4444;
}

.notification-warning {
  border-left: 4px solid #f59e0b;
}

.notification-warning .notification-icon {
  color: #f59e0b;
}

.notification-info {
  border-left: 4px solid #3b82f6;
}

.notification-info .notification-icon {
  color: #3b82f6;
}

/* Animations */
.notification-enter-active {
  transition: all 0.4s ease;
}

.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter {
  transform: translateX(100%);
  opacity: 0;
}

.notification-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>