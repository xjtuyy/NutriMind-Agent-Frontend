<template>
  <div class="layout">
    <aside>
      <div class="brand"><span class="mark">N</span><div><b>NutriMind</b><small>AGENT PLATFORM</small></div></div>
      <div class="nav-label">工作空间</div>
      <nav aria-label="主导航">
        <router-link to="/knowledge"><span class="nav-icon"><el-icon><Collection /></el-icon></span><span>知识库管理</span></router-link>
        <router-link to="/profile"><span class="nav-icon"><el-icon><User /></el-icon></span><span>账户信息</span></router-link>
      </nav>
      <div class="coming"><span class="status-dot"></span><div><b>平台服务正常</b><small>更多智能能力持续接入中</small></div></div>
    </aside>
    <section class="main">
      <header>
        <div class="header-context"><span>NutriMind 工作台</span><b>{{ currentTitle }}</b></div>
        <div class="header-actions">
          <span class="environment"><i></i> 服务在线</span>
          <el-dropdown trigger="click" @command="handleCommand">
            <button class="user" aria-label="打开用户菜单"><span class="avatar">{{ userStore.username.slice(0, 1).toUpperCase() }}</span><span class="user-copy"><b>{{ userStore.username }}</b><small>已认证用户</small></span><el-icon><ArrowDown /></el-icon></button>
            <template #dropdown><el-dropdown-menu><el-dropdown-item command="profile"><el-icon><User /></el-icon>账户信息</el-dropdown-item><el-dropdown-item command="logout" divided><el-icon><SwitchButton /></el-icon>退出登录</el-dropdown-item></el-dropdown-menu></template>
          </el-dropdown>
        </div>
      </header>
      <main><router-view /></main>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { ArrowDown, Collection, SwitchButton, User } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore(), router = useRouter(), route = useRoute()
const currentTitle = computed(() => route.meta.title || '工作台')
onMounted(() => userStore.refreshUser().catch(() => {}))
async function handleCommand(command) {
  if (command === 'profile') router.push('/profile')
  if (command === 'logout') { await userStore.logout(); router.push('/login') }
}
</script>

<style lang="scss" scoped>
.layout { min-height: 100%; display: flex; }
aside { position: fixed; inset: 0 auto 0 0; z-index: 20; width: 248px; padding: 28px 18px 20px; display: flex; flex-direction: column; color: #c7d2dc; background: $navy-deep; border-right: 1px solid rgba(255,255,255,.04); }
.brand { display: flex; align-items: center; gap: 12px; padding: 0 10px 36px; color: #fff; }.brand div { display: flex; flex-direction: column; }.brand b { font-size: 17px; letter-spacing: .01em; }.brand small { margin-top: 3px; color: rgba(255,255,255,.42); font-size: 9px; letter-spacing: .16em; }.mark { width: 38px; height: 38px; display: grid; place-items: center; color: $navy-deep; background: #fff; border-radius: 10px; font-size: 19px; font-weight: 800; }
.nav-label { padding: 0 12px 10px; color: rgba(255,255,255,.34); font-size: 10px; font-weight: 700; letter-spacing: .14em; }
nav { display: grid; gap: 5px; } nav a { min-height: 46px; padding: 7px 10px; display: flex; gap: 11px; align-items: center; border-radius: 9px; color: #aebdca; font-size: 13px; font-weight: 500; transition: color .18s, background .18s; } nav a:hover { color: #fff; background: rgba(255,255,255,.055); } nav a.router-link-active { color: #fff; background: rgba(22,138,107,.24); box-shadow: inset 3px 0 #39c79e; }.nav-icon { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 8px; font-size: 17px; } nav a.router-link-active .nav-icon { color: #67d6b6; background: rgba(22,138,107,.22); }
.coming { margin-top: auto; padding: 14px; display: flex; align-items: flex-start; gap: 10px; border-top: 1px solid rgba(255,255,255,.08); }.status-dot { flex: 0 0 auto; width: 8px; height: 8px; margin-top: 5px; border-radius: 50%; background: #43c59e; box-shadow: 0 0 0 4px rgba(67,197,158,.12); }.coming div { display: flex; flex-direction: column; gap: 4px; }.coming b { color: #dbe5ed; font-size: 11px; font-weight: 600; }.coming small { color: rgba(255,255,255,.38); font-size: 10px; line-height: 1.45; }
.main { min-width: 0; flex: 1; margin-left: 248px; }.main header { position: sticky; top: 0; z-index: 10; height: 72px; padding: 0 34px; display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,.95); border-bottom: 1px solid $border; backdrop-filter: blur(10px); }.main main { width: min(1460px, 100%); margin: 0 auto; padding: 32px 34px 44px; }
.header-context { display: flex; align-items: center; gap: 9px; color: $muted; font-size: 12px; }.header-context span::after { content: "/"; margin-left: 9px; color: $border-strong; }.header-context b { color: $text; font-weight: 600; }.header-actions { display: flex; align-items: center; gap: 24px; }.environment { display: flex; align-items: center; gap: 7px; color: $muted; font-size: 11px; }.environment i { width: 7px; height: 7px; border-radius: 50%; background: #2db487; box-shadow: 0 0 0 3px $primary-soft; }
.user { padding: 4px 6px; display: flex; align-items: center; gap: 10px; color: $text; background: none; border: 0; border-radius: 9px; cursor: pointer; }.user:hover { background: #f4f7f9; }.avatar { width: 34px; height: 34px; display: grid; place-items: center; color: #fff; background: $navy; border-radius: 9px; font-size: 13px; font-weight: 700; }.user-copy { min-width: 86px; display: flex; flex-direction: column; align-items: flex-start; gap: 2px; }.user-copy b { max-width: 110px; overflow: hidden; color: $text; font-size: 12px; font-weight: 600; text-overflow: ellipsis; }.user-copy small { color: $muted; font-size: 9px; }
@media(max-width:760px){ aside { width: 74px; padding: 20px 10px; }.brand { padding: 0 8px 30px; }.brand div,.nav-label,nav a > span:last-child,.coming div { display: none; } nav a { justify-content: center; padding: 7px; } nav a.router-link-active { box-shadow: none; }.coming { justify-content: center; }.main { margin-left: 74px; }.main header { height: 64px; padding: 0 18px; }.main main { padding: 24px 18px 36px; }.header-context span,.environment,.user-copy { display: none; }.header-context span::after { display: none; }.header-actions { gap: 8px; } }
</style>
