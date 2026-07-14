import { defineStore } from 'pinia'
import { getCurrentUserApi, loginApi, logoutApi } from '@/api/auth'

const USER_KEY = 'nutrimind_user'

function readUser() {
  try {
    const user = JSON.parse(localStorage.getItem(USER_KEY) || 'null')
    return user?.is_demo && !import.meta.env.DEV ? null : user
  } catch { return null }
}

export const useUserStore = defineStore('user', {
  state: () => ({ user: readUser() }),
  getters: {
    isLoggedIn: (state) => Boolean(state.user),
    username: (state) => state.user?.username || '',
    isDemo: (state) => Boolean(state.user?.is_demo),
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
      if (this.isDemo) return
      const user = await getCurrentUserApi()
      this.saveUser(user)
    },
    enterDemo() {
      if (!import.meta.env.DEV) return
      this.saveUser({
        id: 10001,
        username: 'NutriMind 体验用户',
        email: 'demo@nutrimind.local',
        phone: null,
        roles: ['体验用户'],
        is_active: true,
        is_demo: true,
        created_at: new Date().toISOString(),
        last_login_at: new Date().toISOString(),
      })
    },
    async logout() {
      if (this.isDemo) { this.clearSession(); return }
      try { await logoutApi() } finally { this.clearSession() }
    },
  },
})
