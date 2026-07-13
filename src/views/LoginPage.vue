<template>
  <AuthShell>
    <h2>欢迎回来</h2><p class="hint">登录后管理你的知识库</p>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="submit">
      <el-form-item label="用户名" prop="username"><el-input v-model="form.username" size="large" placeholder="请输入用户名" /></el-form-item>
      <el-form-item label="密码" prop="password"><el-input v-model="form.password" size="large" type="password" show-password placeholder="至少 6 位" @keyup.enter="submit" /></el-form-item>
      <el-button class="submit" type="primary" size="large" :loading="loading" @click="submit">登录</el-button>
    </el-form>
    <p class="switch">还没有账号？<router-link to="/register">立即注册</router-link></p>
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
h2 { margin: 0; font-size: 30px; }.hint { margin: 8px 0 28px; color: $muted; }.submit { width: 100%; margin-top: 8px; background: $primary; border-color: $primary; }.switch { margin: 24px 0 0; text-align: center; color: $muted; }.switch a { margin-left: 5px; color: $primary; font-weight: 600; }
</style>
