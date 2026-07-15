import { defineStore } from 'pinia'
import { getCurrentUserApi, loginApi, logoutApi } from '@/api/auth'
import { getDefaultRouteForUser, isAdminUser, isUserRoleResolved } from '@/utils/userAccess'

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
    isAdminPreview: (state) => import.meta.env.DEV && Boolean(state.user?.is_demo && state.user?.is_superuser),
    isAdmin: (state) => isAdminUser(state.user),
    roleResolved: (state) => isUserRoleResolved(state.user),
    defaultRoute: (state) => getDefaultRouteForUser(state.user),
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
      const user = await getCurrentUserApi()
      this.saveUser(user || result.user)
    },
    async refreshUser() {
      if (this.isDemo) return
      const user = await getCurrentUserApi()
      this.saveUser(user)
    },
    enterDemo(mode = 'user') {
      if (!import.meta.env.DEV) return
      const isAdminPreview = mode === 'admin'
      this.saveUser({
        id: isAdminPreview ? 10000 : 10001,
        username: isAdminPreview ? 'NutriMind 管理员预览' : 'NutriMind 体验用户',
        email: isAdminPreview ? 'admin-preview@nutrimind.local' : 'demo@nutrimind.local',
        phone: null,
        roles: [isAdminPreview ? 'admin' : '体验用户'],
        is_active: true,
        is_superuser: isAdminPreview,
        is_demo: true,
        demo_mode: isAdminPreview ? 'admin' : 'user',
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
