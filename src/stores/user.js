import { defineStore } from 'pinia'
import { getCurrentUserApi, loginApi, logoutApi } from '@/api/auth'

const USER_KEY = 'nutrimind_user'

function readUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null') } catch { return null }
}

export const useUserStore = defineStore('user', {
  state: () => ({ user: readUser() }),
  getters: {
    isLoggedIn: (state) => Boolean(state.user),
    username: (state) => state.user?.username || '',
  },
  actions: {
    saveUser(user) {
      this.user = user
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    },
    clearSession() {
      this.user = null
      localStorage.removeItem(USER_KEY)
    },
    async login(credentials) {
      const result = await loginApi(credentials)
      this.saveUser(result.user)
    },
    async refreshUser() {
      const user = await getCurrentUserApi()
      this.saveUser(user)
    },
    async logout() {
      try { await logoutApi() } finally { this.clearSession() }
    },
  },
})
