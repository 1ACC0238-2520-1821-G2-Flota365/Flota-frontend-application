<template>
  <div id="app" class="container">
    <Sidebar v-if="!isLoginPage" />
    <main class="main-content" :style="{ marginLeft: !isLoginPage ? '250px' : '0' }">
      <router-view />
      <Notification ref="notification" />
    </main>
  </div>
</template>

<script>
import { Sidebar, Notification } from '@/components/common'

export default {
  name: 'App',
  components: {
    Sidebar,
    Notification
  },
  computed: {
    isLoginPage() {
      return this.$route.path === '/login'
    }
  },
  methods: {
    // Método global para mostrar notificaciones usando tu sistema original
    showNotification(message, type = 'info', duration = 5000) {
      this.$refs.notification.addNotification(message, type, duration)
    }
  }
}
</script>

<style>
@import '@/assets/css/styles.css';
@import '@/assets/css/notifications.css';
</style>