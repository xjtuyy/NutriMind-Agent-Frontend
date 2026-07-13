<template>
  <div class="layout">
    <aside>
      <div class="brand"><span class="mark">N</span><div><b>NutriMind</b><small>AGENT</small></div></div>
      <nav>
        <router-link to="/knowledge"><el-icon><Collection /></el-icon>知识库</router-link>
        <router-link to="/profile"><el-icon><User /></el-icon>个人信息</router-link>
      </nav>
      <div class="coming"><b>持续建设中</b><span>Agent、检测和训练模块将在后端接口完成后接入。</span></div>
    </aside>
    <section class="main">
      <header><span>知识驱动的智能体平台</span><el-dropdown @command="handleCommand"><button class="user">{{ userStore.username.slice(0, 1).toUpperCase() }}<span>{{ userStore.username }}</span></button><template #dropdown><el-dropdown-menu><el-dropdown-item command="logout">退出登录</el-dropdown-item></el-dropdown-menu></template></el-dropdown></header>
      <main><router-view /></main>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Collection, User } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore(), router = useRouter()
onMounted(() => userStore.refreshUser().catch(() => {}))
async function handleCommand(command) { if (command === 'logout') { await userStore.logout(); router.push('/login') } }
</script>

<style lang="scss" scoped>
.layout { min-height: 100%; display: flex; } aside { position: fixed; inset: 0 auto 0 0; width: 230px; padding: 28px 18px; color: #dbe9e4; background: #193e35; display: flex; flex-direction: column; }.brand { display: flex; align-items: center; gap: 12px; padding: 0 8px 34px; color: white; }.brand div { display: flex; flex-direction: column; }.brand small { margin-top: 2px; font-size: 10px; letter-spacing: .18em; opacity: .6; }.mark { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 11px; background: #dceee7; color: #193e35; font-weight: 900; } nav { display: grid; gap: 8px; } nav a { display: flex; gap: 12px; align-items: center; padding: 13px 14px; border-radius: 10px; } nav a:hover, nav a.router-link-active { color: white; background: rgba(255,255,255,.12); }.coming { margin-top: auto; padding: 15px; border: 1px solid rgba(255,255,255,.12); border-radius: 12px; display: grid; gap: 8px; font-size: 12px; line-height: 1.55; }.coming span { opacity: .65; }.main { min-width: 0; flex: 1; margin-left: 230px; }.main header { height: 68px; padding: 0 32px; display: flex; align-items: center; justify-content: space-between; background: white; border-bottom: 1px solid $border; color: $muted; }.main main { padding: 32px; }.user { display: flex; align-items: center; gap: 10px; border: 0; background: none; color: $text; cursor: pointer; }.user:first-letter { color: white; background: $primary; }.user { width: auto; min-height: 34px; }.user > span { display: inline; }.user::first-line { border-radius: 50%; } @media(max-width:720px){ aside{ width:76px; padding:20px 10px}.brand div,nav a:not(.router-link-active){ font-size:0}.brand{padding:0 10px 30px}.coming{display:none}.main{margin-left:76px}.main header{padding:0 16px}.main header>span{display:none}.main main{padding:18px}.user span{display:none}nav a{justify-content:center;font-size:0}nav a .el-icon{font-size:20px} }
</style>
