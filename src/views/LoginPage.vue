<template>
  <AuthShell>
    <span class="form-eyebrow">开启健康管理</span>
    <h2>欢迎回来</h2><p class="hint">登录 NutriMind，继续记录你的健康改变</p>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="submit">
      <el-form-item label="用户名" prop="username"><el-input v-model="form.username" size="large" placeholder="请输入用户名" autocomplete="username" /></el-form-item>
      <el-form-item label="登录密码" prop="password"><el-input v-model="form.password" size="large" type="password" show-password placeholder="请输入登录密码" autocomplete="current-password" @keyup.enter="submit" /></el-form-item>
      <el-button class="submit" type="primary" size="large" :loading="loading" @click="submit">开始使用</el-button>
    </el-form>
    <div class="divider"><span>第一次来到 NutriMind</span></div>
    <p class="switch">还没有账户？<router-link to="/register">创建账户</router-link></p>
  </AuthShell>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import AuthShell from '@/components/AuthShell.vue'
import { useUserStore } from '@/stores/user'

const formRef = ref()
const loading = ref(false)
const form = reactive({ username: '', password: '' })
const rules = {
  username: [{ required: true, message: '请输入用户名' }, { min: 3, max: 50, message: '长度为 3–50 个字符' }],
  password: [{ required: true, message: '请输入密码' }, { min: 6, message: '密码至少 6 位' }],
}
const router = useRouter(), route = useRoute(), userStore = useUserStore()
async function submit() {
  if (!await formRef.value.validate().catch(() => false)) return
  loading.value = true
  try { await userStore.login(form); ElMessage.success('登录成功'); router.push(String(route.query.redirect || '/')) } finally { loading.value = false }
}
</script>

<style lang="scss" scoped>
.form-eyebrow { display: block; margin-bottom: 10px; color: $primary; font-size: 11px; font-weight: 700; letter-spacing: .12em; }.hint { margin: 9px 0 30px; color: $text-secondary; line-height: 1.6; } h2 { margin: 0; color: $navy; font-size: 30px; font-weight: 650; letter-spacing: -.03em; }.submit { width: 100%; height: 44px; margin-top: 8px; font-weight: 600; }.divider { position: relative; margin: 28px 0 20px; color: $muted; font-size: 10px; text-align: center; }.divider::before { content: ""; position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: $border; }.divider span { position: relative; padding: 0 12px; background: #fff; }.switch { margin: 0; text-align: center; color: $text-secondary; font-size: 12px; }.switch a { margin-left: 6px; color: $primary; font-weight: 650; }
</style>
