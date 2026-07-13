<template>
  <AuthShell>
    <h2>创建账号</h2><p class="hint">开始建立你的专属知识库</p>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="submit">
      <el-form-item label="用户名" prop="username"><el-input v-model="form.username" size="large" /></el-form-item>
      <el-form-item label="邮箱" prop="email"><el-input v-model="form.email" size="large" /></el-form-item>
      <el-form-item label="密码" prop="password"><el-input v-model="form.password" size="large" type="password" show-password /></el-form-item>
      <el-button class="submit" type="primary" size="large" :loading="loading" @click="submit">注册</el-button>
    </el-form>
    <p class="switch">已有账号？<router-link to="/login">返回登录</router-link></p>
  </AuthShell>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import AuthShell from '@/components/AuthShell.vue'
import { registerApi } from '@/api/auth'
const formRef = ref(), loading = ref(false), router = useRouter()
const form = reactive({ username: '', email: '', password: '' })
const rules = {
  username: [{ required: true, message: '请输入用户名' }, { min: 3, max: 50, message: '长度为 3–50 个字符' }],
  email: [{ required: true, message: '请输入邮箱' }, { type: 'email', message: '邮箱格式不正确' }],
  password: [{ required: true, message: '请输入密码' }, { min: 6, message: '密码至少 6 位' }],
}
async function submit() {
  if (!await formRef.value.validate().catch(() => false)) return
  loading.value = true
  try { await registerApi(form); ElMessage.success('注册成功，请登录'); router.push('/login') } finally { loading.value = false }
}
</script>

<style lang="scss" scoped>
h2 { margin: 0; font-size: 30px; }.hint { margin: 8px 0 24px; color: $muted; }.submit { width: 100%; margin-top: 8px; background: $primary; border-color: $primary; }.switch { margin: 24px 0 0; text-align: center; color: $muted; }.switch a { margin-left: 5px; color: $primary; font-weight: 600; }
</style>
