<template>
  <div class="page-head"><div><span class="eyebrow">HEALTH ACCOUNT</span><h1 class="page-title">健康账户</h1><p class="page-description">管理你的基础账户信息，为后续个性化饮食目标做好准备。</p></div><el-tag type="success" effect="light" round>账户状态正常</el-tag></div>
  <div class="profile-grid">
    <section class="panel identity">
      <div class="avatar">{{ userStore.username.slice(0, 1).toUpperCase() }}</div>
      <h2>{{ userStore.username }}</h2>
      <p>{{ userStore.user?.email || '未设置邮箱' }}</p>
      <span class="role">{{ roleText }}</span>
      <div class="verified"><el-icon><CircleCheckFilled /></el-icon><div><b>身份认证已启用</b><span>当前会话受到安全认证保护</span></div></div>
    </section>
    <section class="panel details">
      <div class="section-heading"><h2>基本资料</h2><span>账户 ID：{{ userStore.user?.id || '--' }}</span></div>
      <dl v-if="userStore.user">
        <div><dt>用户名</dt><dd>{{ userStore.user.username }}</dd></div>
        <div><dt>电子邮箱</dt><dd>{{ userStore.user.email || '未填写' }}</dd></div>
        <div><dt>手机号码</dt><dd>{{ userStore.user.phone || '未填写' }}</dd></div>
        <div><dt>账户角色</dt><dd>{{ roleText }}</dd></div>
        <div><dt>最后登录</dt><dd>{{ formatDate(userStore.user.last_login_at) }}</dd></div>
        <div><dt>注册时间</dt><dd>{{ formatDate(userStore.user.created_at) }}</dd></div>
      </dl>
      <div class="notice"><el-icon><InfoFilled /></el-icon><p><b>资料修改暂未开放</b><span>当前后端仅支持账户信息查询。编辑资料、修改密码等功能将在接口开放后接入。</span></p></div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { CircleCheckFilled, InfoFilled } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
const roleText = computed(() => userStore.user?.roles?.join('、') || '普通用户')
function formatDate(value) { return value ? new Date(value).toLocaleString('zh-CN') : '暂无记录' }
</script>

<style lang="scss" scoped>
.page-head { margin-bottom:24px; display:flex; align-items:flex-end; justify-content:space-between; gap:20px; }.eyebrow { display:block; margin-bottom:8px; color:$primary; font-size:10px; font-weight:750; letter-spacing:.14em; }.profile-grid { max-width:1040px; display:grid; grid-template-columns:300px 1fr; gap:20px; }.identity { align-self:start; padding:34px 24px; text-align:center; }.avatar { width:76px; height:76px; margin:0 auto 16px; display:grid; place-items:center; color:#fff; background:$navy; border-radius:20px; box-shadow:0 0 0 7px #edf2f5; font-size:28px; font-weight:700; }.identity h2 { margin:0; color:$navy; font-size:20px; font-weight:650; }.identity > p { margin:7px 0 13px; color:$muted; font-size:11px; }.role { display:inline-flex; padding:5px 10px; color:$primary; background:$primary-soft; border-radius:20px; font-size:10px; font-weight:650; }.verified { margin-top:30px; padding:16px 0 0; display:flex; gap:10px; align-items:flex-start; border-top:1px solid $border; text-align:left; }.verified>.el-icon { margin-top:2px; color:$primary; font-size:16px; }.verified div { display:grid; gap:4px; }.verified b { color:$text; font-size:10px; }.verified span { color:$muted; font-size:9px; line-height:1.45; }.details { padding:0; overflow:hidden; }.section-heading { height:68px; padding:0 24px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid $border; }.section-heading h2 { margin:0; color:$navy; font-size:16px; font-weight:650; }.section-heading span { color:$muted; font-size:10px; } dl { margin:0; padding:10px 24px; } dl>div { min-height:52px; display:grid; grid-template-columns:130px 1fr; align-items:center; border-bottom:1px solid #edf1f4; } dl>div:last-child { border-bottom:0; } dt { color:$muted; font-size:10px; } dd { margin:0; color:$text; font-size:12px; font-weight:500; }.notice { margin:8px 24px 24px; padding:14px; display:flex; gap:10px; color:#526b7c; background:#f3f7fa; border:1px solid #e2eaf0; border-radius:9px; }.notice>.el-icon { flex:0 0 auto; margin-top:2px; color:#5b7fa0; }.notice p { margin:0; display:grid; gap:4px; }.notice b { font-size:10px; }.notice span { color:$muted; font-size:9px; line-height:1.5; }
@media(max-width:850px){.profile-grid{grid-template-columns:1fr}.identity{display:grid;grid-template-columns:auto 1fr;column-gap:18px;text-align:left}.avatar{grid-row:1/4;margin:0}.identity h2{align-self:end}.identity>p{margin:4px 0}.role{justify-self:start}.verified{grid-column:1/-1}} @media(max-width:520px){.page-head{align-items:flex-start;flex-direction:column}.identity{display:block;text-align:center}.avatar{margin:0 auto 16px}.role{display:inline-flex}.section-heading{padding:0 18px}dl{padding:10px 18px}dl>div{grid-template-columns:105px 1fr}.notice{margin:8px 18px 18px}}
</style>
