<template>
  <AuthShell>
    <span class="form-eyebrow">加入 NutriMind</span>
    <h2>创建健康账户</h2><p class="hint">从看懂每一餐开始，建立更适合你的饮食方式</p>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="submit">
      <el-form-item label="用户名" prop="username"><el-input v-model="form.username" size="large" placeholder="3–50 个字符" autocomplete="username" /></el-form-item>
      <el-form-item label="电子邮箱" prop="email"><el-input v-model="form.email" size="large" placeholder="name@example.com" autocomplete="email" /></el-form-item>
      <el-form-item label="登录密码" prop="password"><el-input v-model="form.password" size="large" type="password" show-password placeholder="至少 6 位" autocomplete="new-password" /></el-form-item>
      <el-button class="submit" type="primary" size="large" :loading="loading" @click="submit">创建账户</el-button>
    </el-form>
    <p class="agreement">注册即表示您已阅读并同意平台使用规范与隐私政策</p>
    <p class="switch">已有账户？<router-link to="/login">返回登录</router-link></p>
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
.form-eyebrow { display: block; margin-bottom: 10px; color: $primary; font-size: 11px; font-weight: 700; letter-spacing: .12em; }.hint { margin: 9px 0 24px; color: $text-secondary; line-height: 1.6; } h2 { margin: 0; color: $navy; font-size: 29px; font-weight: 650; letter-spacing: -.03em; }.submit { width: 100%; height: 44px; margin-top: 6px; font-weight: 600; }.agreement { margin: 16px 0 22px; color: $muted; font-size: 10px; line-height: 1.6; text-align: center; }.switch { margin: 0; padding-top: 20px; border-top: 1px solid $border; text-align: center; color: $text-secondary; font-size: 12px; }.switch a { margin-left: 6px; color: $primary; font-weight: 650; }
</style>
