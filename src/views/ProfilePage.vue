<template>
  <div class="profile-page page-shell">
    <header class="page-header">
      <div>
        <span class="eyebrow"><Target :size="16" weight="bold" /> BODY & GOALS</span>
        <h1 class="page-title">目标不是数字，<br><em>是下一次选择。</em></h1>
        <p class="page-description">把身体目标和训练节奏交给 NutriMind，后续建议会围绕这套基准展开。</p>
      </div>
      <span class="status-chip"><CheckCircle :size="16" weight="fill" /> 配置已同步至本机</span>
    </header>

    <section class="profile-grid">
      <aside class="identity-card surface">
        <div class="identity-top">
          <div class="avatar" aria-hidden="true">{{ userInitial }}</div>
          <span class="account-state"><span /> ACTIVE</span>
        </div>
        <span class="identity-kicker">ATHLETE PROFILE</span>
        <h2>{{ userStore.username }}</h2>
        <p>{{ userStore.user?.email || '未设置邮箱' }}</p>
        <span class="role">{{ roleText }}</span>

        <div class="goal-readout">
          <div>
            <small>当前计划</small>
            <strong>{{ modeLabel }}</strong>
          </div>
          <TrendDown v-if="profile.mode === 'cut'" :size="34" weight="duotone" />
          <Barbell v-else-if="profile.mode === 'muscle'" :size="34" weight="duotone" />
          <Heartbeat v-else :size="34" weight="duotone" />
        </div>

        <div class="weight-progress">
          <div><span>{{ profile.currentWeight || '--' }} kg</span><span>目标 {{ profile.targetWeight || '--' }} kg</span></div>
          <div class="progress-track"><i :style="{ width: `${goalProgress}%` }" /></div>
          <small>计划配置完整度 {{ goalProgress }}%</small>
        </div>

        <dl>
          <div><dt><IdentificationCard :size="17" /> 账户 ID</dt><dd>{{ userStore.user?.id || '--' }}</dd></div>
          <div><dt><Phone :size="17" /> 手机</dt><dd>{{ userStore.user?.phone || '未填写' }}</dd></div>
          <div><dt><ClockCounterClockwise :size="17" /> 最近登录</dt><dd>{{ formatDate(userStore.user?.last_login_at) }}</dd></div>
        </dl>
      </aside>

      <nav class="profile-tabs surface" role="tablist" aria-label="个人资料设置">
        <button
          id="goals-tab"
          type="button"
          role="tab"
          :class="{ active: activeTab === 'goals' }"
          :aria-selected="activeTab === 'goals'"
          aria-controls="goals-panel"
          @click="activeTab = 'goals'"
        >
          <Target :size="19" :weight="activeTab === 'goals' ? 'fill' : 'regular'" />
          <span><b>身体目标</b><small>体重、热量与训练节奏</small></span>
        </button>
        <button
          id="security-tab"
          type="button"
          role="tab"
          :class="{ active: activeTab === 'security' }"
          :aria-selected="activeTab === 'security'"
          aria-controls="security-panel"
          @click="activeTab = 'security'"
        >
          <LockKey :size="19" :weight="activeTab === 'security' ? 'fill' : 'regular'" />
          <span><b>账户安全</b><small>修改你的登录密码</small></span>
        </button>
      </nav>

      <section
        v-if="activeTab === 'goals'"
        id="goals-panel"
        class="goal-panel surface tab-panel"
        role="tabpanel"
        aria-labelledby="goals-tab"
      >
        <div class="panel-heading">
          <div>
            <span>PERSONAL BASELINE</span>
            <h2 class="section-title">设置你的身体目标</h2>
          </div>
          <span class="step-mark">01 / 02</span>
        </div>

        <section class="form-section" aria-labelledby="goal-mode-title">
          <div class="section-label">
            <span>01</span>
            <div><h3 id="goal-mode-title">你当前最重要的目标</h3><p>它会决定热量和营养建议的侧重点。</p></div>
          </div>
          <div class="mode-grid">
            <button
              v-for="mode in modes"
              :key="mode.value"
              type="button"
              :class="{ active: profile.mode === mode.value }"
              :aria-pressed="profile.mode === mode.value"
              @click="profile.mode = mode.value"
            >
              <component :is="mode.icon" :size="24" :weight="profile.mode === mode.value ? 'fill' : 'regular'" />
              <b>{{ mode.label }}</b>
              <span>{{ mode.description }}</span>
            </button>
          </div>
        </section>

        <section class="form-section" aria-labelledby="body-data-title">
          <div class="section-label">
            <span>02</span>
            <div><h3 id="body-data-title">身体与补给基准</h3><p>先给出可执行的初始值，后面可以随进度调整。</p></div>
          </div>
          <div class="field-grid">
            <FuelField v-model="profile.currentWeight" label="当前体重（kg）" type="number" min="30" max="250" placeholder="例如 72" />
            <FuelField v-model="profile.targetWeight" label="目标体重（kg）" type="number" min="30" max="250" placeholder="例如 66" />
            <FuelField v-model="profile.dailyCalories" label="每日热量目标（kcal）" type="number" min="1000" max="6000" placeholder="例如 1900" />
            <FuelField v-model="profile.proteinTarget" label="每日蛋白质（g）" type="number" min="30" max="400" placeholder="例如 130" />
          </div>
          <label class="training-days">
            <span><CalendarDots :size="18" /> 每周训练频率</span>
            <div>
              <button
                v-for="day in 7"
                :key="day"
                type="button"
                :class="{ active: Number(profile.trainingDays) === day }"
                :aria-label="`每周训练 ${day} 天`"
                :aria-pressed="Number(profile.trainingDays) === day"
                @click="profile.trainingDays = day"
              >{{ day }}</button>
            </div>
            <small>{{ trainingCopy }}</small>
          </label>
        </section>

        <footer class="form-footer">
          <div class="local-note"><LockKey :size="18" /><span><b>当前为前端本地配置</b>数据只保存在这台设备，不会修改后端账户资料。</span></div>
          <FuelButton :loading="saving" @click="saveProfile">保存目标配置</FuelButton>
        </footer>
      </section>

      <section
        v-else
        id="security-panel"
        class="security-panel surface tab-panel"
        role="tabpanel"
        aria-labelledby="security-tab"
      >
        <div class="security-heading">
          <div class="security-icon"><LockKey :size="22" weight="bold" /></div>
          <div>
            <span>ACCOUNT SECURITY</span>
            <h2 id="security-title" class="section-title">修改登录密码</h2>
            <p>验证当前密码后设置新密码，新密码至少需要 6 位。</p>
          </div>
        </div>
        <el-form
          ref="passwordFormRef"
          class="security-form"
          :model="passwordForm"
          :rules="passwordRules"
          label-position="top"
          @submit.prevent="changePassword"
        >
          <div class="security-fields">
            <el-form-item label="当前密码" prop="old_password">
              <el-input v-model="passwordForm.old_password" type="password" show-password autocomplete="current-password" placeholder="输入当前密码" />
            </el-form-item>
            <el-form-item label="新密码" prop="new_password">
              <el-input v-model="passwordForm.new_password" type="password" show-password autocomplete="new-password" placeholder="至少 6 位" />
            </el-form-item>
            <el-form-item label="确认新密码" prop="confirm_password">
              <el-input v-model="passwordForm.confirm_password" type="password" show-password autocomplete="new-password" placeholder="再次输入新密码" />
            </el-form-item>
          </div>
          <div class="security-footer">
            <p>{{ userStore.isDemo ? '体验模式没有真实账户，不能修改密码。' : '密码不会保存在浏览器本地。' }}</p>
            <FuelButton native-type="submit" :loading="passwordSaving" :disabled="userStore.isDemo">确认修改密码</FuelButton>
          </div>
        </el-form>
      </section>
    </section>
  </div>
</template>

<script setup>
import { computed, markRaw, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  PhBarbell as Barbell, PhCalendarDots as CalendarDots, PhCheckCircle as CheckCircle,
  PhClockCounterClockwise as ClockCounterClockwise, PhHeartbeat as Heartbeat,
  PhIdentificationCard as IdentificationCard, PhLockKey as LockKey,
  PhPersonSimpleRun as PersonSimpleRun, PhPhone as Phone, PhTarget as Target,
  PhTrendDown as TrendDown,
} from '@phosphor-icons/vue'
import FuelButton from '@/components/ui/FuelButton.vue'
import FuelField from '@/components/ui/FuelField.vue'
import { changePasswordApi } from '@/api/auth'
import { useUserStore } from '@/stores/user'

const PROFILE_KEY = 'nutrimind_goal_profile'
const defaults = {
  mode: 'cut', currentWeight: 72, targetWeight: 66,
  dailyCalories: 1900, proteinTarget: 130, trainingDays: 4,
}

function loadProfile() {
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}') }
  } catch {
    return { ...defaults }
  }
}

const userStore = useUserStore()
const profile = reactive(loadProfile())
const activeTab = ref('goals')
const saving = ref(false)
const passwordSaving = ref(false)
const passwordFormRef = ref()
const passwordForm = reactive({ old_password: '', new_password: '', confirm_password: '' })
const passwordRules = {
  old_password: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  new_password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '新密码至少 6 位', trigger: 'blur' },
  ],
  confirm_password: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value === passwordForm.new_password) callback()
        else callback(new Error('两次输入的新密码不一致'))
      },
      trigger: 'blur',
    },
  ],
}
const modes = [
  { value: 'cut', label: '减脂', description: '控制热量，保住训练表现', icon: markRaw(TrendDown) },
  { value: 'muscle', label: '增肌', description: '稳定盈余，优先蛋白质', icon: markRaw(Barbell) },
  { value: 'maintain', label: '保持', description: '维持体态，提高饮食质量', icon: markRaw(PersonSimpleRun) },
]

const roleText = computed(() => userStore.user?.roles?.join('、') || '普通用户')
const userInitial = computed(() => userStore.username.slice(0, 1).toUpperCase() || 'N')
const modeLabel = computed(() => modes.find((item) => item.value === profile.mode)?.label || '自定义')
const goalProgress = computed(() => {
  const fields = ['mode', 'currentWeight', 'targetWeight', 'dailyCalories', 'proteinTarget', 'trainingDays']
  return Math.round(fields.filter((key) => Boolean(profile[key])).length / fields.length * 100)
})
const trainingCopy = computed(() => {
  const days = Number(profile.trainingDays)
  if (days <= 2) return '轻量节奏，优先建立稳定习惯。'
  if (days <= 4) return '均衡节奏，训练与恢复都有空间。'
  return '高频节奏，请特别关注睡眠与恢复。'
})

function formatDate(value) {
  if (!value) return '暂无记录'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '暂无记录'
  return new Intl.DateTimeFormat('zh-CN', { month: 'short', day: 'numeric' }).format(date)
}

async function saveProfile() {
  const required = [profile.currentWeight, profile.targetWeight, profile.dailyCalories, profile.proteinTarget]
  if (required.some((value) => !value || Number(value) <= 0)) {
    ElMessage.warning('请填写完整且有效的身体与补给数据')
    return
  }
  saving.value = true
  await new Promise((resolve) => setTimeout(resolve, 360))
  localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...profile }))
  saving.value = false
  ElMessage.success('目标配置已保存到当前设备')
}

async function changePassword() {
  if (userStore.isDemo) {
    ElMessage.warning('体验模式不能修改密码')
    return
  }
  if (!await passwordFormRef.value.validate().catch(() => false)) return
  passwordSaving.value = true
  try {
    await changePasswordApi({
      old_password: passwordForm.old_password,
      new_password: passwordForm.new_password,
    })
    passwordFormRef.value.resetFields()
    ElMessage.success('密码修改成功')
  } finally {
    passwordSaving.value = false
  }
}
</script>

<style lang="scss" scoped>
.profile-page { display: grid; gap: 22px; }
.page-header { min-height: 235px; padding: clamp(26px, 4vw, 56px); display: flex; align-items: flex-end; justify-content: space-between; gap: 26px; background: linear-gradient(110deg, rgba(23,28,24,.98), rgba(15,18,16,.9)), radial-gradient(circle at 83% 18%, rgba(242,117,63,.17), transparent 34%); border: 1px solid var(--border); border-radius: var(--radius-lg); }
.page-header em { color: var(--accent); font-style: normal; }
.eyebrow { margin-bottom: 17px; display: flex; align-items: center; gap: 8px; color: var(--primary); font-size: .74rem; font-weight: 700; letter-spacing: .13em; }
.profile-grid { display: grid; grid-template-columns: minmax(280px, .72fr) minmax(0, 1.6fr); gap: 16px; align-items: start; }
.identity-card { grid-row: 1 / span 2; padding: 24px; }
.profile-tabs { grid-column: 2; padding: 6px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.profile-tabs button { min-height: 64px; padding: 10px 14px; display: flex; align-items: center; gap: 11px; color: var(--muted); text-align: left; background: transparent; border: 1px solid transparent; border-radius: 11px; transition: color 180ms var(--ease-out), background 180ms var(--ease-out), border-color 180ms var(--ease-out); }
.profile-tabs button:hover { color: var(--text-secondary); background: rgba(255,255,255,.025); }
.profile-tabs button.active { color: var(--primary); background: var(--primary-soft); border-color: rgba(159,226,75,.2); }
.profile-tabs button > span { display: grid; gap: 2px; }
.profile-tabs b { color: var(--text); font-size: .82rem; }
.profile-tabs small { color: var(--muted); font-size: .72rem; }
.tab-panel { grid-column: 2; animation: tab-in 220ms var(--ease-out); }
@keyframes tab-in { from { opacity: 0; transform: translateY(7px); } }
.identity-top { margin-bottom: 26px; display: flex; align-items: flex-start; justify-content: space-between; }
.avatar { width: 76px; height: 76px; display: grid; place-items: center; color: #12170f; background: var(--primary); border-radius: 19px 19px 19px 5px; box-shadow: 10px 10px 0 rgba(159,226,75,.1); font-family: "Barlow Condensed"; font-size: 2.15rem; font-weight: 700; }
.account-state { display: inline-flex; align-items: center; gap: 6px; color: var(--primary); font-size: .7rem; font-weight: 700; letter-spacing: .12em; }
.account-state span { width: 7px; height: 7px; background: var(--primary); border-radius: 50%; box-shadow: 0 0 0 4px rgba(159,226,75,.09); }
.identity-kicker { color: var(--muted); font-size: .7rem; font-weight: 700; letter-spacing: .13em; }
.identity-card h2 { margin: 5px 0 2px; overflow-wrap: anywhere; font-family: "Barlow Condensed"; font-size: 1.85rem; font-weight: 600; line-height: 1; }
.identity-card > p { margin: 7px 0 12px; overflow: hidden; color: var(--muted); font-size: .78rem; text-overflow: ellipsis; white-space: nowrap; }
.role { padding: 5px 8px; display: inline-flex; color: var(--text-secondary); background: var(--surface-soft); border-radius: 6px; font-size: .68rem; }
.goal-readout { margin: 28px 0 21px; padding: 17px; display: flex; align-items: center; justify-content: space-between; background: linear-gradient(130deg, rgba(159,226,75,.12), rgba(159,226,75,.025)); border: 1px solid rgba(159,226,75,.18); border-radius: 12px; }
.goal-readout div { display: grid; gap: 2px; }
.goal-readout small { color: var(--muted); }
.goal-readout strong { font-family: "Barlow Condensed"; font-size: 1.45rem; font-weight: 600; }
.goal-readout svg { color: var(--primary); }
.weight-progress > div:first-child { display: flex; justify-content: space-between; color: var(--text-secondary); font-size: .75rem; }
.progress-track { height: 6px; margin: 9px 0 8px; overflow: hidden; background: var(--surface-soft); border-radius: 6px; }
.progress-track i { height: 100%; display: block; background: linear-gradient(90deg, var(--primary), var(--accent)); border-radius: inherit; }
.weight-progress small { color: var(--muted); font-size: .67rem; }
.identity-card dl { margin: 25px 0 0; padding-top: 12px; border-top: 1px solid var(--border); }
.identity-card dl > div { min-height: 46px; display: flex; align-items: center; justify-content: space-between; gap: 12px; border-bottom: 1px solid var(--border); }
.identity-card dl > div:last-child { border-bottom: 0; }
.identity-card dt { display: flex; align-items: center; gap: 7px; color: var(--muted); font-size: .72rem; }
.identity-card dd { margin: 0; max-width: 48%; overflow: hidden; color: var(--text-secondary); font-size: .74rem; text-overflow: ellipsis; white-space: nowrap; }
.goal-panel { padding: clamp(20px, 3vw, 34px); }
.security-panel { padding: clamp(20px, 3vw, 30px); }
.security-heading { margin-bottom: 22px; display: flex; align-items: flex-start; gap: 14px; }
.security-icon { width: 44px; height: 44px; flex: 0 0 auto; display: grid; place-items: center; color: #11160f; background: var(--primary); border-radius: 11px; }
.security-heading > div:last-child > span { display: block; margin-bottom: 4px; color: var(--primary); font-size: .7rem; font-weight: 700; letter-spacing: .13em; }
.security-heading p { margin: 6px 0 0; color: var(--muted); font-size: .76rem; }
.security-fields { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.security-footer { padding-top: 18px; display: flex; align-items: center; justify-content: space-between; gap: 18px; border-top: 1px solid var(--border); }
.security-footer p { margin: 0; color: var(--muted); font-size: .72rem; }
.panel-heading { margin-bottom: 5px; padding-bottom: 24px; display: flex; align-items: flex-end; justify-content: space-between; border-bottom: 1px solid var(--border); }
.panel-heading > div > span { display: block; margin-bottom: 5px; color: var(--primary); font-size: .7rem; font-weight: 700; letter-spacing: .13em; }
.step-mark { color: var(--muted); font-family: "Barlow Condensed"; font-size: 1rem; }
.form-section { padding: 26px 0; border-bottom: 1px solid var(--border); }
.section-label { margin-bottom: 18px; display: flex; gap: 13px; }
.section-label > span { width: 29px; height: 29px; display: grid; place-items: center; color: #11160f; background: var(--primary); border-radius: 8px; font-family: "Barlow Condensed"; font-weight: 700; }
.section-label h3 { margin: 0; font-size: .96rem; }
.section-label p { margin: 4px 0 0; color: var(--muted); font-size: .76rem; }
.mode-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.mode-grid button { min-height: 125px; padding: 17px; display: flex; flex-direction: column; align-items: flex-start; gap: 7px; color: var(--text-secondary); text-align: left; background: var(--canvas-soft); border: 1px solid var(--border); border-radius: 12px; transition: transform 180ms var(--ease-out), border-color 180ms var(--ease-out), background 180ms var(--ease-out); }
.mode-grid button:hover { border-color: var(--border-strong); transform: translateY(-2px); }
.mode-grid button.active { color: var(--primary); background: var(--primary-soft); border-color: rgba(159,226,75,.42); box-shadow: inset 0 -3px 0 var(--primary); }
.mode-grid button b { color: var(--text); }
.mode-grid button span { color: var(--muted); font-size: .7rem; line-height: 1.45; }
.field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 17px 14px; }
.training-days { margin-top: 22px; display: grid; gap: 10px; }
.training-days > span { display: flex; align-items: center; gap: 8px; color: var(--text-secondary); font-size: .84rem; font-weight: 500; }
.training-days > span svg { color: var(--primary); }
.training-days > div { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; }
.training-days button { min-height: 42px; color: var(--text-secondary); background: var(--canvas-soft); border: 1px solid var(--border); border-radius: 9px; }
.training-days button:hover { border-color: var(--border-strong); }
.training-days button.active { color: #11160f; background: var(--primary); border-color: var(--primary); font-weight: 700; }
.training-days small { color: var(--muted); font-size: .72rem; }
.form-footer { padding-top: 23px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.local-note { max-width: 440px; display: flex; align-items: flex-start; gap: 9px; color: var(--muted); font-size: .72rem; line-height: 1.5; }
.local-note svg { flex: 0 0 auto; color: var(--primary); }
.local-note b { display: block; color: var(--text-secondary); }
@media (max-width: 1040px) {
  .profile-grid { grid-template-columns: 1fr; }
  .identity-card { grid-row: auto; }
  .profile-tabs, .tab-panel { grid-column: 1; }
  .identity-card { display: grid; grid-template-columns: auto 1fr; column-gap: 24px; }
  .identity-top { grid-row: 1 / 5; display: block; }
  .account-state { margin-top: 16px; display: flex; }
  .goal-readout, .weight-progress, .identity-card dl { grid-column: 1 / -1; }
}
@media (max-width: 700px) {
  .page-header { min-height: 210px; align-items: flex-start; }
  .page-header .status-chip { display: none; }
  .profile-tabs button { justify-content: center; text-align: center; }
  .profile-tabs small { display: none; }
  .mode-grid { grid-template-columns: 1fr; }
  .mode-grid button { min-height: 88px; display: grid; grid-template-columns: auto 1fr; grid-template-rows: auto auto; column-gap: 12px; }
  .mode-grid button svg { grid-row: 1 / 3; }
  .field-grid { grid-template-columns: 1fr; }
  .security-fields { grid-template-columns: 1fr; }
  .security-footer { align-items: stretch; flex-direction: column; }
  .security-footer .fuel-button { width: 100%; }
  .form-footer { align-items: stretch; flex-direction: column; }
  .form-footer .fuel-button { width: 100%; }
}
@media (max-width: 460px) {
  .identity-card { display: block; }
  .identity-top { display: flex; }
  .account-state { margin-top: 0; }
  .training-days > div { gap: 5px; }
}
</style>
