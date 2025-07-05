import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loaded: false
  }),
  actions: {
    async loadUser() {
      const stored = localStorage.getItem('user')
      if (stored) {
        this.user = JSON.parse(stored)
      }
      this.loaded = true
    },
    login(user) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(user))
      this.loaded = true
    },
    logout() {
      this.user = null
      localStorage.removeItem('user')
      this.loaded = false
    }
  }
})
