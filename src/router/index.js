import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: () => import('@/views/LoginPage.vue'), meta: { public: true, title: '登录' } },
    { path: '/register', component: () => import('@/views/RegisterPage.vue'), meta: { public: true, title: '注册' } },
    {
      path: '/',
      component: () => import('@/components/MainLayout.vue'),
      redirect: '/knowledge',
      children: [
        { path: 'knowledge', component: () => import('@/views/KnowledgePage.vue'), meta: { title: '营养知识库' } },
        { path: 'profile', component: () => import('@/views/ProfilePage.vue'), meta: { title: '健康账户' } },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  document.title = `${to.meta.title || '首页'} - NutriMind Agent`
  const userStore = useUserStore()
  if (!to.meta.public && !userStore.isLoggedIn) return { path: '/login', query: { redirect: to.fullPath } }
  if (to.meta.public && userStore.isLoggedIn) return '/'
})

export default router
