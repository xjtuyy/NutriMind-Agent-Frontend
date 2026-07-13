<template>
  <h1 class="page-title">个人信息</h1><p class="page-description">查看当前账号资料</p>
  <section class="panel profile">
    <div class="avatar">{{ userStore.username.slice(0, 1).toUpperCase() }}</div>
    <el-descriptions v-if="userStore.user" :column="1" border>
      <el-descriptions-item label="用户名">{{ userStore.user.username }}</el-descriptions-item>
      <el-descriptions-item label="邮箱">{{ userStore.user.email || '未填写' }}</el-descriptions-item>
      <el-descriptions-item label="手机号">{{ userStore.user.phone || '未填写' }}</el-descriptions-item>
      <el-descriptions-item label="角色">{{ userStore.user.roles?.join('、') || '普通用户' }}</el-descriptions-item>
      <el-descriptions-item label="注册时间">{{ formatDate(userStore.user.created_at) }}</el-descriptions-item>
    </el-descriptions>
    <el-alert title="当前后端仅提供用户信息查询，资料编辑功能将在对应接口完成后开放。" type="info" :closable="false" show-icon />
  </section>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
function formatDate(value) { return value ? new Date(value).toLocaleString('zh-CN') : '暂无记录' }
</script>

<style lang="scss" scoped>
.profile { max-width:760px; display:grid; gap:24px; }.avatar { width:72px; height:72px; display:grid; place-items:center; border-radius:20px; background:$primary; color:white; font-size:30px; font-weight:700; }
</style>
