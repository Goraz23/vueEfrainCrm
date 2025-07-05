import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loaded: false
  }),

  actions: {
    loadUser() {
      const stored = localStorage.getItem('user')
      if (stored) {
        try {
          this.user = JSON.parse(stored)
        } catch (e) {
          this.user = null
        }
      }
      this.loaded = true
    },

    login(credentials) {
      const hardcodedUser = {
        email: 'admin@example.com',
        password: '123456',
        name: 'Admin User'
      }

      if (
        credentials.email === hardcodedUser.email &&
        credentials.password === hardcodedUser.password
      ) {
        const user = {
          email: hardcodedUser.email,
          name: hardcodedUser.name
        }
        this.user = user
        localStorage.setItem('user', JSON.stringify(user))
        this.loaded = true
        return true
      } else {
        return false
      }
    },

    logout() {
      this.user = null
      this.loaded = false
      localStorage.removeItem('user')
    }
  }
})