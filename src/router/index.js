import { nextTick } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/login', name: 'login', component: () => import('@/views/LoginPage.vue'), meta: { public: true, title: '登录' } },
    { path: '/register', name: 'register', component: () => import('@/views/RegisterPage.vue'), meta: { public: true, title: '注册' } },
    {
      path: '/',
      component: () => import('@/components/MainLayout.vue'),
      redirect: '/today',
      children: [
        { path: 'today', name: 'today', component: () => import('@/views/TodayPage.vue'), meta: { title: '今日状态' } },
        { path: 'coach', name: 'coach', component: () => import('@/views/ChatPage.vue'), meta: { title: 'AI 教练' } },
        { path: 'scan', name: 'scan', component: () => import('@/views/FoodScanPage.vue'), meta: { title: '食物分析' } },
        { path: 'library', name: 'library', component: () => import('@/views/KnowledgePage.vue'), meta: { title: '运动营养库' } },
        { path: 'profile', name: 'profile', component: () => import('@/views/ProfilePage.vue'), meta: { title: '身体与目标' } },
      ],
    },
    { path: '/chat', redirect: '/coach' },
    { path: '/knowledge', redirect: '/library' },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  document.title = `${to.meta.title || '首页'} - NutriMind`
  const userStore = useUserStore()
  if (!to.meta.public && !userStore.isLoggedIn) return { path: '/login', query: { redirect: to.fullPath } }
  if (to.meta.public && userStore.isLoggedIn) return '/today'
})

router.afterEach(() => {
  nextTick(() => document.querySelector('#main-content')?.focus({ preventScroll: true }))
})

export default router
