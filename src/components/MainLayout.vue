<template>
  <div class="app-layout">
    <a class="skip-link" href="#main-content">跳到主要内容</a>

    <aside class="app-rail" aria-label="主导航">
      <router-link class="brand" to="/today" aria-label="NutriMind 今日状态">
        <Lightning :size="23" weight="fill" aria-hidden="true" />
        <span>NM</span>
      </router-link>

      <nav>
        <router-link v-for="item in navItems" :key="item.path" :to="item.path">
          <component :is="item.icon" :size="22" :weight="route.path === item.path ? 'fill' : 'regular'" aria-hidden="true" />
          <span>{{ item.label }}</span>
        </router-link>
      </nav>

      <button class="rail-profile" aria-label="打开个人资料" @click="router.push('/profile')">
        {{ userInitial }}
      </button>
    </aside>

    <section class="app-stage">
      <header class="topbar">
        <div class="wordmark">
          <b>NutriMind</b>
          <span>{{ route.meta.title }}</span>
        </div>
        <div class="top-actions">
          <span class="service-state"><CloudCheck :size="17" weight="bold" /> {{ userStore.isDemo ? '预览数据' : '服务在线' }}</span>
          <el-dropdown trigger="click" @command="handleCommand">
            <button class="account-button" aria-label="打开账户菜单">
              <span>{{ userInitial }}</span>
              <div><b>{{ userStore.username }}</b><small>Performance Fuel</small></div>
              <CaretDown :size="15" weight="bold" />
            </button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile"><UserCircle :size="17" />身体与目标</el-dropdown-item>
                <el-dropdown-item command="logout" divided><SignOut :size="17" />退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <main id="main-content" tabindex="-1">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in"><component :is="Component" /></transition>
        </router-view>
      </main>
    </section>
  </div>
</template>

<script setup>
import { computed, markRaw, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  PhBarbell as Barbell, PhBookOpenText as BookOpenText, PhCaretDown as CaretDown,
  PhChartDonut as ChartDonut, PhCloudCheck as CloudCheck, PhLightning as Lightning,
  PhScanSmiley as ScanSmiley, PhSignOut as SignOut, PhSparkle as Sparkle,
  PhUserCircle as UserCircle,
} from '@phosphor-icons/vue'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const navItems = [
  { path: '/today', label: '今日', icon: markRaw(ChartDonut) },
  { path: '/coach', label: '教练', icon: markRaw(Sparkle) },
  { path: '/scan', label: '分析', icon: markRaw(ScanSmiley) },
  { path: '/library', label: '营养库', icon: markRaw(BookOpenText) },
  { path: '/profile', label: '目标', icon: markRaw(Barbell) },
]
const userInitial = computed(() => userStore.username.slice(0, 1).toUpperCase() || 'N')

onMounted(() => userStore.refreshUser().catch(() => {}))

async function handleCommand(command) {
  if (command === 'profile') router.push('/profile')
  if (command === 'logout') {
    await userStore.logout()
    router.push('/login')
  }
}
</script>

<style lang="scss" scoped>
.app-layout { min-height: 100dvh; display: flex; }
.app-rail {
  position: fixed;
  z-index: var(--z-nav);
  inset: 18px auto 18px 18px;
  width: 92px;
  padding: 12px 9px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(20, 25, 21, .94);
  border: 1px solid var(--border);
  border-radius: 20px;
  box-shadow: $shadow;
  backdrop-filter: blur(18px);
}
.brand {
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  color: #11160f;
  background: var(--primary);
  border-radius: 15px;
}
.brand span { font-family: "Barlow Condensed"; font-size: .68rem; font-weight: 700; line-height: 1; }
.app-rail nav { width: 100%; margin: auto 0; display: grid; gap: 8px; }
.app-rail nav a {
  min-height: 58px;
  padding: 7px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: var(--muted);
  border-radius: 13px;
  font-size: .7rem;
  transition: color 180ms var(--ease-out), background 180ms var(--ease-out), transform 180ms var(--ease-out);
}
.app-rail nav a:hover { color: var(--text); background: rgba(255,255,255,.04); transform: translateY(-1px); }
.app-rail nav a.router-link-active { color: var(--primary); background: var(--primary-soft); }
.rail-profile { width: 46px; height: 46px; color: var(--text); background: var(--surface-soft); border: 1px solid var(--border); border-radius: 12px; font-weight: 600; }
.app-stage { min-width: 0; flex: 1; margin-left: 128px; }
.topbar { height: 78px; padding: 0 30px 0 4px; display: flex; align-items: center; justify-content: space-between; }
.wordmark { display: flex; align-items: baseline; gap: 10px; }
.wordmark b { font-family: "Barlow Condensed"; font-size: 1.15rem; letter-spacing: .01em; }
.wordmark span { color: var(--muted); font-size: .78rem; }
.top-actions { display: flex; align-items: center; gap: 16px; }
.service-state { min-height: 36px; padding: 0 11px; display: inline-flex; align-items: center; gap: 7px; color: var(--primary); background: var(--primary-soft); border-radius: 8px; font-size: .75rem; }
.account-button { min-height: 48px; padding: 4px 7px; display: flex; align-items: center; gap: 9px; color: var(--text); background: transparent; border: 1px solid transparent; border-radius: 11px; }
.account-button:hover { background: var(--surface); border-color: var(--border); }
.account-button > span { width: 36px; height: 36px; display: grid; place-items: center; color: #12170f; background: var(--primary); border-radius: 9px; font-weight: 700; }
.account-button div { min-width: 106px; display: grid; gap: 1px; text-align: left; }
.account-button b { max-width: 130px; overflow: hidden; font-size: .8rem; text-overflow: ellipsis; white-space: nowrap; }
.account-button small { color: var(--muted); font-size: .66rem; }
main { min-height: calc(100dvh - 78px); padding: 8px 30px 34px 4px; outline: none; }
.page-enter-active, .page-leave-active { transition: opacity 180ms var(--ease-out), transform 220ms var(--ease-out); }
.page-enter-from { opacity: 0; transform: translateY(10px); }
.page-leave-to { opacity: 0; transform: translateY(-6px); }

@media (max-width: 900px) {
  .app-stage { margin-left: 0; }
  .app-rail { inset: auto 12px max(12px, env(safe-area-inset-bottom)) 12px; width: auto; height: 70px; padding: 7px 10px; flex-direction: row; }
  .brand, .rail-profile { display: none; }
  .app-rail nav { margin: 0; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 4px; }
  .app-rail nav a { min-height: 54px; min-width: 58px; padding: 5px 9px; font-size: .65rem; }
  .topbar { padding: 0 18px; }
  main { padding: 8px 16px 100px; }
}
@media (max-width: 620px) {
  .service-state, .account-button div, .wordmark span { display: none; }
  .top-actions { gap: 4px; }
  .app-rail nav a { min-width: 0; padding-inline: 5px; }
}
</style>
