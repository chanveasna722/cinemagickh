<template>
  <div class="login-modal-overlay" @click="emit('close')">
    <div class="login-modal-container" @click.stop>
      <button class="login-modal-close" @click="emit('close')">✕</button>
      <h2>Welcome Back</h2>
      <form @submit.prevent="handleLogin">
        <input type="email" v-model="email" placeholder="Email" required />
        <input type="password" v-model="password" placeholder="Password" required />
        <button type="submit" :disabled="loading">Sign In</button>
      </form>
      <p>Don't have an account? <a href="#" @click.prevent="emit('switch-to-signup')">Sign up</a></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'switch-to-signup'): void
}>()

const authStore = useAuthStore()
const email = ref('popcorn@gmail.com')
const password = ref('seang123')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  const result = await authStore.login(email.value, password.value)
  loading.value = false
  
  if (result.success) {
    emit('close')
    window.location.reload()
  } else {
    alert(result.error || 'Login failed')
  }
}
</script>

<style scoped>
.login-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.login-modal-container {
  background: #1a1a2e;
  padding: 40px;
  border-radius: 20px;
  width: 90%;
  max-width: 400px;
  color: white;
}
.login-modal-close {
  float: right;
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}
input {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  color: white;
}
button[type="submit"] {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  margin-top: 10px;
}
</style>
