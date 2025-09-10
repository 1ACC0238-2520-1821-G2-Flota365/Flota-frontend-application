<template>
  <div class="header">
    <h1>{{ title }}</h1>
    <div class="user-info">
      <div class="user-avatar">{{ userInitials }}</div>
      <div>
        <p style="font-weight: bold; margin: 0;">{{ userData.name }}</p>
        <p style="font-size: 0.875rem; color: #666; margin: 0;">{{ userData.role }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      userData: {
        name: 'Juan Supervisor',
        role: 'Administrador'
      }
    }
  },
  computed: {
    userInitials() {
      return this.userData.name.split(' ').map(n => n[0]).join('').toUpperCase()
    }
  }
}
</script>