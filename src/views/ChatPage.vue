<template>
  <div class="page-shell coach-page">
    <header class="page-head">
      <div>
        <span class="status-chip"><Sparkle :size="16" weight="fill" /> AI 营养教练</span>
        <h1 class="page-title">问清楚，再吃。</h1>
        <p class="page-description">围绕减脂、增肌、训练补给和食物选择，获得更容易执行的建议。</p>
      </div>
      <div class="page-actions">
        <button
          class="context-toggle"
          type="button"
          :aria-pressed="contextHidden"
          :aria-label="contextHidden ? '显示当前计划' : '隐藏当前计划'"
          @click="toggleContext"
        >
          <SidebarSimple :size="18" weight="bold" />
          {{ contextHidden ? '显示计划' : '隐藏计划' }}
        </button>
        <FuelButton variant="secondary" :arrow="false" @click="resetChat"><ArrowsClockwise :size="18" /> 新对话</FuelButton>
      </div>
    </header>

    <section class="chat-workspace surface" :class="{ 'context-hidden': contextHidden }">
      <div class="conversation">
        <div ref="messageArea" class="messages" aria-live="polite">
          <section v-if="messages.length === 1" class="welcome">
            <div class="coach-mark"><Lightning :size="34" weight="fill" /></div>
            <h2>今天想解决什么问题？</h2>
            <p>描述你的目标、训练时间和饮食情况，信息越具体，建议越容易执行。</p>
            <div class="quick-grid">
              <button v-for="item in prompts" :key="item.title" @click="selectPrompt(item.question)">
                <component :is="item.icon" :size="23" weight="duotone" />
                <span><b>{{ item.title }}</b><small>{{ item.detail }}</small></span>
                <ArrowRight :size="17" weight="bold" />
              </button>
            </div>
          </section>

          <article v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
            <span v-if="message.role === 'assistant'" class="message-avatar"><Lightning :size="17" weight="fill" /></span>
            <div class="message-body">
              <small>{{ message.role === 'assistant' ? 'Nutri 教练' : '你' }}</small>
              <div v-if="message.pending" class="typing"><i /><i /><i /><span>正在整理建议</span></div>
              <div v-else class="markdown" v-html="renderMarkdown(message.content)" />
              <section v-if="message.nutrition" class="answer-card">
                <div v-for="item in message.nutrition" :key="item.label"><span>{{ item.label }}</span><strong class="metric-number">{{ item.value }}</strong></div>
              </section>
            </div>
          </article>
        </div>

        <div class="composer-wrap">
          <div class="composer">
            <textarea
              ref="composerInput"
              v-model="question"
              rows="1"
              maxlength="500"
              aria-label="输入营养问题"
              placeholder="例如：晚上力量训练，减脂期晚饭怎么吃？"
              @input="resizeComposer"
              @keydown.enter.exact.prevent="sendMessage"
            />
            <div class="composer-footer">
              <button class="attach" aria-label="上传食物图片" @click="router.push('/scan')"><Camera :size="20" /></button>
              <span>Enter 发送，Shift + Enter 换行</span>
              <FuelButton class="send-button" :arrow="false" :disabled="!question.trim() || generating" @click="sendMessage">
                <CircleNotch v-if="generating" class="spin" :size="19" weight="bold" />
                <PaperPlaneTilt v-else :size="19" weight="fill" />
                发送
              </FuelButton>
            </div>
          </div>
          <small class="disclaimer">建议仅用于日常健康管理，不能替代专业医疗诊断。</small>
        </div>
      </div>

      <aside class="context-panel" :aria-hidden="contextHidden">
        <div class="context-title"><span>当前计划</span><Target :size="22" weight="duotone" /></div>
        <div class="goal-summary">
          <small>目标</small><strong>减脂</strong><span>每日预算 2,140 kcal</span>
        </div>
        <div class="context-metrics">
          <div><span>蛋白质</span><strong class="metric-number">108 / 150g</strong></div>
          <div><span>今日训练</span><strong>上肢推拉</strong></div>
          <div><span>剩余热量</span><strong class="metric-number">680 kcal</strong></div>
        </div>
        <div class="source-box">
          <BookOpenText :size="21" weight="duotone" />
          <div><b>知识库已启用</b><p>回答可以结合已上传的营养资料。</p></div>
        </div>
      </aside>
    </section>
  </div>
</template>

<script setup>
import { markRaw, nextTick, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  PhArrowRight as ArrowRight, PhArrowsClockwise as ArrowsClockwise,
  PhBookOpenText as BookOpenText, PhBowlFood as BowlFood, PhCamera as Camera,
  PhCircleNotch as CircleNotch, PhForkKnife as ForkKnife, PhLightning as Lightning,
  PhPaperPlaneTilt as PaperPlaneTilt, PhPersonSimpleRun as PersonSimpleRun,
  PhSidebarSimple as SidebarSimple, PhSparkle as Sparkle, PhTarget as Target,
} from '@phosphor-icons/vue'
import FuelButton from '@/components/ui/FuelButton.vue'
import { renderMarkdown } from '@/utils/markdown'

const router = useRouter()
const question = ref('')
const generating = ref(false)
const messageArea = ref(null)
const composerInput = ref(null)
const contextHidden = ref(readContextPreference())
let responseTimer
const CONTEXT_KEY = 'nutrimind_coach_context_hidden'
const firstMessage = { role: 'assistant', content: '你好，我是 Nutri 教练。告诉我你的目标、训练安排或刚刚吃了什么。' }
const messages = ref([{ ...firstMessage }])
const prompts = [
  { title: '安排减脂晚餐', detail: '控制热量，也保证饱腹感', question: '我正在减脂，今晚还剩 680 千卡，晚饭怎么安排？', icon: markRaw(ForkKnife) },
  { title: '优化训练补给', detail: '训练前后应该怎样吃', question: '我晚上六点半力量训练，训练前后分别吃什么？', icon: markRaw(PersonSimpleRun) },
  { title: '分析一顿饭', detail: '判断热量和营养组成', question: '如何判断一顿饭的蛋白质和热量是否适合减脂？', icon: markRaw(BowlFood) },
]

function readContextPreference() {
  try { return localStorage.getItem('nutrimind_coach_context_hidden') === 'true' }
  catch { return false }
}

function toggleContext() {
  contextHidden.value = !contextHidden.value
  try { localStorage.setItem(CONTEXT_KEY, String(contextHidden.value)) }
  catch { /* Keep the preference for this page session. */ }
}

function resizeComposer() {
  const input = composerInput.value
  if (!input) return
  input.style.height = 'auto'
  input.style.height = `${Math.min(input.scrollHeight, 130)}px`
}

async function selectPrompt(value) {
  question.value = value
  await nextTick()
  resizeComposer()
  composerInput.value?.focus()
}

async function scrollToEnd() {
  await nextTick()
  if (messageArea.value) messageArea.value.scrollTop = messageArea.value.scrollHeight
}

function sendMessage() {
  const content = question.value.trim()
  if (!content || generating.value) return
  messages.value.push({ role: 'user', content })
  messages.value.push({ role: 'assistant', pending: true, content: '' })
  question.value = ''
  nextTick(resizeComposer)
  generating.value = true
  scrollToEnd()
  responseTimer = window.setTimeout(() => {
    messages.value[messages.value.length - 1] = {
      role: 'assistant',
      content: '**建议思路**\n\n把晚餐放在训练后，优先保证蛋白质和适量碳水。可以选择 150g 鸡胸肉、120g 熟米饭和 200g 绿叶蔬菜。少油烹饪后，这一餐更容易控制在你的剩余预算内。',
      nutrition: [
        { label: '预计热量', value: '520 kcal' },
        { label: '蛋白质', value: '48g' },
        { label: '碳水', value: '55g' },
      ],
    }
    generating.value = false
    scrollToEnd()
  }, 900)
}

function resetChat() {
  window.clearTimeout(responseTimer)
  generating.value = false
  question.value = ''
  nextTick(resizeComposer)
  messages.value = [{ ...firstMessage }]
}

onBeforeUnmount(() => window.clearTimeout(responseTimer))
</script>

<style lang="scss" scoped>
.coach-page { padding-bottom: 30px; }
.page-head { margin-bottom: 24px; display: flex; align-items: end; justify-content: space-between; gap: 24px; }
.page-head .status-chip { margin-bottom: 16px; }
.page-actions { display: flex; align-items: center; gap: 9px; }
.context-toggle { min-height: 48px; padding: 0 14px; display: inline-flex; align-items: center; justify-content: center; gap: 8px; color: var(--text-secondary); background: transparent; border: 1px solid var(--border-strong); border-radius: 10px; font-size: .8rem; font-weight: 600; }
.context-toggle:hover { color: var(--primary); background: var(--surface); border-color: rgba(159,226,75,.32); }
.chat-workspace { height: max(680px, calc(100dvh - 220px)); display: grid; grid-template-columns: minmax(0, 1fr) 290px; overflow: hidden; }
.chat-workspace.context-hidden { grid-template-columns: minmax(0, 1fr); }
.context-hidden .context-panel { display: none; }
.conversation { min-width: 0; min-height: 0; display: flex; flex-direction: column; }
.messages { min-height: 0; flex: 1; padding: 30px clamp(20px, 5vw, 74px); overflow-y: auto; overscroll-behavior: contain; scrollbar-gutter: stable; scroll-behavior: smooth; }
.welcome { max-width: 820px; margin: 5vh auto 42px; text-align: center; }
.coach-mark { width: 72px; height: 72px; margin: 0 auto 20px; display: grid; place-items: center; color: #10150e; background: var(--primary); border-radius: 18px; transform: rotate(-4deg); box-shadow: 10px 10px 0 rgba(159,226,75,.13); }
.welcome h2 { margin: 0 0 10px; font-family: "Barlow Condensed", MiSans, sans-serif; font-size: clamp(2rem, 4vw, 3.2rem); line-height: 1; }
.welcome > p { max-width: 52ch; margin: 0 auto 28px; color: var(--text-secondary); line-height: 1.65; }
.quick-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; text-align: left; }
.quick-grid button { min-height: 112px; padding: 16px; display: grid; grid-template-columns: auto 1fr auto; align-items: start; gap: 10px; color: var(--text); background: var(--canvas-soft); border: 1px solid var(--border); border-radius: 12px; transition: transform 180ms var(--ease-out), border-color 180ms var(--ease-out); }
.quick-grid button:hover { border-color: rgba(159,226,75,.35); transform: translateY(-2px); }
.quick-grid button > svg { color: var(--primary); }
.quick-grid button span { display: grid; gap: 4px; }
.quick-grid b { font-size: .85rem; }
.quick-grid small { color: var(--muted); font-size: .7rem; line-height: 1.45; }
.message { max-width: 820px; margin: 0 auto 26px; display: flex; gap: 12px; }
.message.user { justify-content: flex-end; }
.message-avatar { flex: 0 0 auto; width: 36px; height: 36px; display: grid; place-items: center; color: #11160f; background: var(--primary); border-radius: 10px; }
.message-body { max-width: min(680px, 85%); }
.message-body > small { margin-bottom: 6px; display: block; color: var(--muted); font-size: .68rem; }
.user .message-body > small { text-align: right; }
.markdown { padding: 14px 17px; color: var(--text-secondary); background: var(--surface-raised); border: 1px solid var(--border); border-radius: 5px 15px 15px 15px; line-height: 1.7; }
.user .markdown { color: #151b12; background: var(--primary); border-color: var(--primary); border-radius: 15px 5px 15px 15px; }
.markdown :deep(p) { margin: 0 0 10px; }
.markdown :deep(p:last-child) { margin-bottom: 0; }
.answer-card { margin-top: 8px; display: grid; grid-template-columns: repeat(3, 1fr); background: var(--canvas-soft); border: 1px solid var(--border); border-radius: 10px; }
.answer-card div { padding: 12px; display: grid; gap: 4px; border-right: 1px solid var(--border); }
.answer-card div:last-child { border-right: 0; }
.answer-card span { color: var(--muted); font-size: .67rem; }
.answer-card strong { color: var(--primary); font-size: 1.25rem; font-weight: 500; }
.typing { min-width: 220px; padding: 16px; display: flex; align-items: center; gap: 5px; color: var(--muted); background: var(--surface-raised); border-radius: 5px 15px 15px 15px; font-size: .72rem; }
.typing i { width: 6px; height: 6px; background: var(--primary); border-radius: 50%; animation: pulse 900ms ease-in-out infinite alternate; }
.typing i:nth-child(2) { animation-delay: 120ms; }.typing i:nth-child(3) { animation-delay: 240ms; }.typing span { margin-left: 5px; }
@keyframes pulse { to { opacity: .28; transform: translateY(-3px); } }
.composer-wrap { flex: 0 0 auto; padding: 12px 22px 16px; border-top: 1px solid var(--border); }
.composer { padding: 11px; background: var(--canvas-soft); border: 1px solid var(--border-strong); border-radius: 14px; }
.composer textarea { width: 100%; height: 52px; min-height: 52px; max-height: 130px; padding: 8px; overflow-y: auto; color: var(--text); background: transparent; border: 0; outline: 0; resize: none; line-height: 1.55; }
.composer textarea::placeholder { color: #737d74; }
.composer-footer { display: flex; align-items: center; gap: 10px; }
.attach { width: 44px; height: 44px; display: grid; place-items: center; color: var(--text-secondary); background: var(--surface); border: 1px solid var(--border); border-radius: 9px; }
.composer-footer > span { color: var(--muted); font-size: .68rem; }
.send-button { min-height: 44px; margin-left: auto; }
.disclaimer { margin: 9px 0 0; display: block; color: var(--muted); font-size: .65rem; text-align: center; }
.spin { animation: spin 800ms linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }
.context-panel { min-height: 0; padding: 24px; overflow-y: auto; background: rgba(13,16,15,.55); border-left: 1px solid var(--border); }
.context-title { display: flex; align-items: center; justify-content: space-between; color: var(--primary); font-size: .8rem; font-weight: 600; }
.goal-summary { margin: 30px 0; padding: 20px; display: grid; gap: 5px; background: var(--surface); border-radius: 12px; }
.goal-summary small, .goal-summary span { color: var(--muted); font-size: .7rem; }
.goal-summary strong { font-family: "Barlow Condensed"; font-size: 2.5rem; line-height: 1; }
.context-metrics { display: grid; }
.context-metrics div { padding: 15px 0; display: grid; gap: 4px; border-bottom: 1px solid var(--border); }
.context-metrics span { color: var(--muted); font-size: .68rem; }
.context-metrics strong { font-size: .85rem; font-weight: 500; }
.source-box { margin-top: 26px; padding: 15px; display: flex; gap: 10px; color: var(--primary); background: var(--primary-soft); border-radius: 10px; }
.source-box b { color: var(--text); font-size: .78rem; }.source-box p { margin: 4px 0 0; color: var(--muted); font-size: .68rem; line-height: 1.5; }

@media (max-width: 1050px) { .chat-workspace { grid-template-columns: 1fr; }.context-panel, .context-toggle { display: none; } }
@media (max-width: 760px) {
  .page-head { align-items: flex-start; flex-direction: column; }
  .page-head > :last-child { width: 100%; }
  .page-actions > * { flex: 1; }
  .chat-workspace { height: calc(100dvh - 250px); min-height: 620px; }
  .messages { padding: 22px 14px; }
  .welcome { margin-top: 2vh; }
  .quick-grid { grid-template-columns: 1fr; }
  .quick-grid button { min-height: 80px; }
  .composer-wrap { padding: 10px; }
  .composer-footer > span { display: none; }
  .answer-card { grid-template-columns: 1fr; }
  .answer-card div { border-right: 0; border-bottom: 1px solid var(--border); }
  .answer-card div:last-child { border-bottom: 0; }
}
</style>
