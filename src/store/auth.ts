import { defineStore } from 'pinia'
const API_URL = import.meta.env.VITE_API_URL

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    loaded: false
  }),

  actions: {
    loadUser() {
      const stored = localStorage.getItem('user')
      const token = localStorage.getItem('token')
      if (stored && token) {
        try {
          this.user = JSON.parse(stored)
          this.token = token
        } catch (e) {
          this.user = null
          this.token = null
        }
      }
      this.loaded = true
    },

    async login(credentials) {
      try {
        const res = await fetch(`${API_URL}/users/authenticate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        })
        const data = await res.json()
        // console.log('Login response:', data)
        if (
          data.status === 'success' &&
          data.data?.token &&
          data.data?.user?.role === 'admin'
        ) {
          this.user = data.data.user
          this.token = data.data.token
          localStorage.setItem('user', JSON.stringify(this.user))
          localStorage.setItem('token', this.token)
          this.loaded = true
          return true
        } else {
          this.user = null
          this.token = null
          localStorage.removeItem('user')
          localStorage.removeItem('token')
          return false
        }
      } catch (e) {
        return false
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.loaded = false
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  }
})