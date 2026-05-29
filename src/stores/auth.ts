import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const isAuthenticated = ref(!!token.value)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isLoggedIn = computed(() => isAuthenticated.value && !!token.value)
  const isAdmin = computed(() => user.value?.role_id === 1)

  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch('https://api.cinemagickh.com/api/v2/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      const data = await response.json()
      
      if (data.code === 200) {
        user.value = data.data?.user
        token.value = data.data?.token
        isAuthenticated.value = true
        
        localStorage.setItem('auth_token', data.data?.token)
        localStorage.setItem('user', JSON.stringify(data.data?.user))
        
        return { success: true, user: data.data?.user, data: data.data }
      } else {
        throw new Error(data.message || 'Login failed')
      }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    isAuthenticated.value = false
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }

  return { user, token, loading, error, isLoggedIn, isAdmin, login, logout }
})
