<template>
  <div class="page-shell scan-page">
    <header class="page-head">
      <div>
        <span class="status-chip"><ScanSmiley :size="16" weight="bold" /> 食物分析预览</span>
        <h1 class="page-title">拍下来，看懂这一餐。</h1>
        <p class="page-description">上传清晰的餐食照片，预览热量、蛋白质和主要食材的分析流程。</p>
      </div>
    </header>

    <section class="scan-grid">
      <div class="upload-side surface">
        <input ref="fileInput" class="sr-only" type="file" accept="image/jpeg,image/png,image/webp" @change="selectFile" />
        <button v-if="!previewUrl" class="drop-zone" @click="fileInput.click()">
          <span><CameraPlus :size="34" weight="duotone" /></span>
          <b>选择或拍摄食物照片</b>
          <p>支持 JPG、PNG 和 WebP，建议光线充足并拍到完整餐盘。</p>
        </button>
        <div v-else class="preview">
          <img :src="previewUrl" alt="等待分析的食物照片" />
          <button aria-label="重新选择照片" @click="fileInput.click()"><ArrowsClockwise :size="19" weight="bold" /></button>
        </div>

        <div class="scan-actions">
          <div><small>当前文件</small><b>{{ fileName || '尚未选择' }}</b></div>
          <FuelButton :disabled="!previewUrl" :loading="analyzing" @click="analyze">开始分析</FuelButton>
        </div>
      </div>

      <aside class="process-side surface">
        <h2 class="section-title">分析过程</h2>
        <p>后端识别接口接入后，将按相同顺序返回真实结果。</p>
        <ol>
          <li v-for="(step, index) in steps" :key="step.title" :class="{ active: stage === index, done: stage > index }">
            <span><Check v-if="stage > index" :size="17" weight="bold" /><component :is="step.icon" v-else :size="19" /></span>
            <div><b>{{ step.title }}</b><small>{{ step.detail }}</small></div>
          </li>
        </ol>
      </aside>
    </section>

    <section v-if="resultVisible" class="result surface" aria-live="polite">
      <div class="result-heading">
        <div><span>示例估算结果</span><h2>鸡胸肉杂粮餐</h2><p>实际结果会受到食材重量、烹饪方式和调味用量影响。</p></div>
        <strong class="metric-number"><CountUp :to="572" suffix=" kcal" /></strong>
      </div>
      <div class="nutrition-grid">
        <article><span>蛋白质</span><strong class="metric-number">46g</strong><small>建议优先保证</small></article>
        <article><span>碳水</span><strong class="metric-number">61g</strong><small>适合训练后补充</small></article>
        <article><span>脂肪</span><strong class="metric-number">16g</strong><small>主要来自烹饪用油</small></article>
        <article class="ingredients"><span>识别到的食材</span><p>鸡胸肉、糙米、玉米、西兰花、胡萝卜</p><button @click="router.push('/coach')">询问如何调整 <ArrowRight :size="17" weight="bold" /></button></article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { markRaw, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  PhArrowRight as ArrowRight, PhArrowsClockwise as ArrowsClockwise,
  PhCameraPlus as CameraPlus, PhCheck as Check, PhCirclesThreePlus as CirclesThreePlus,
  PhScanSmiley as ScanSmiley, PhSparkle as Sparkle, PhSquaresFour as SquaresFour,
} from '@phosphor-icons/vue'
import FuelButton from '@/components/ui/FuelButton.vue'
import CountUp from '@/components/motion/CountUp.vue'

const router = useRouter()
const fileInput = ref(null)
const fileName = ref('')
const previewUrl = ref('')
const analyzing = ref(false)
const resultVisible = ref(false)
const stage = ref(-1)
let timers = []
const steps = [
  { title: '识别主要食材', detail: '定位餐盘中的食物种类', icon: markRaw(SquaresFour) },
  { title: '估算食材分量', detail: '结合餐盘比例推算重量', icon: markRaw(CirclesThreePlus) },
  { title: '生成营养结果', detail: '汇总热量和三大营养素', icon: markRaw(Sparkle) },
]

function selectFile(event) {
  const file = event.target.files?.[0]
  if (!file) return
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = URL.createObjectURL(file)
  fileName.value = file.name
  resultVisible.value = false
  stage.value = -1
}

function analyze() {
  timers.forEach(window.clearTimeout)
  analyzing.value = true
  resultVisible.value = false
  stage.value = 0
  timers = [
    window.setTimeout(() => { stage.value = 1 }, 550),
    window.setTimeout(() => { stage.value = 2 }, 1050),
    window.setTimeout(() => {
      stage.value = 3
      analyzing.value = false
      resultVisible.value = true
    }, 1600),
  ]
}

onBeforeUnmount(() => {
  timers.forEach(window.clearTimeout)
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})
</script>

<style lang="scss" scoped>
.scan-page { padding-bottom: 34px; }
.page-head { margin-bottom: 26px; }
.page-head .status-chip { margin-bottom: 16px; }
.scan-grid { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(310px, .75fr); gap: 18px; }
.upload-side { min-height: 540px; padding: 22px; display: flex; flex-direction: column; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }
.drop-zone { min-height: 420px; padding: 32px; display: grid; place-content: center; justify-items: center; color: var(--text); background: radial-gradient(circle at 50% 42%, rgba(159,226,75,.08), transparent 13rem), var(--canvas-soft); border: 1px dashed var(--border-strong); border-radius: 14px; text-align: center; transition: border-color 200ms var(--ease-out), background 200ms var(--ease-out); }
.drop-zone:hover { border-color: var(--primary); background-color: rgba(159,226,75,.03); }
.drop-zone > span { width: 70px; height: 70px; margin-bottom: 18px; display: grid; place-items: center; color: var(--primary); background: var(--primary-soft); border-radius: 17px; }
.drop-zone b { font-family: "Barlow Condensed", MiSans, sans-serif; font-size: 1.75rem; }
.drop-zone p { max-width: 42ch; margin: 9px 0 0; color: var(--muted); line-height: 1.6; }
.preview { position: relative; min-height: 420px; overflow: hidden; border-radius: 14px; }
.preview img { width: 100%; height: 420px; object-fit: cover; }
.preview button { position: absolute; top: 14px; right: 14px; width: 46px; height: 46px; display: grid; place-items: center; color: var(--text); background: rgba(13,16,15,.82); border: 1px solid var(--border-strong); border-radius: 10px; backdrop-filter: blur(10px); }
.scan-actions { margin-top: 18px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.scan-actions > div { min-width: 0; display: grid; gap: 4px; }
.scan-actions small { color: var(--muted); font-size: .7rem; }
.scan-actions b { max-width: 360px; overflow: hidden; font-size: .82rem; text-overflow: ellipsis; white-space: nowrap; }
.process-side { padding: 28px; }
.process-side > p { margin: 8px 0 28px; color: var(--muted); font-size: .8rem; line-height: 1.6; }
.process-side ol { margin: 0; padding: 0; display: grid; list-style: none; }
.process-side li { position: relative; min-height: 92px; display: grid; grid-template-columns: 44px 1fr; gap: 13px; opacity: .45; }
.process-side li::after { content: ''; position: absolute; top: 42px; bottom: 4px; left: 21px; width: 1px; background: var(--border-strong); }
.process-side li:last-child::after { display: none; }
.process-side li > span { width: 44px; height: 44px; display: grid; place-items: center; color: var(--muted); background: var(--canvas-soft); border: 1px solid var(--border); border-radius: 11px; }
.process-side li div { padding-top: 3px; display: grid; align-content: start; gap: 4px; }
.process-side li b { font-size: .85rem; }.process-side li small { color: var(--muted); font-size: .72rem; }
.process-side li.active, .process-side li.done { opacity: 1; }
.process-side li.active > span { color: #11160f; background: var(--primary); border-color: var(--primary); box-shadow: 0 0 0 6px var(--primary-soft); }
.process-side li.done > span { color: #11160f; background: var(--primary); border-color: var(--primary); }
.result { margin-top: 18px; padding: clamp(22px, 4vw, 38px); }
.result-heading { display: flex; align-items: end; justify-content: space-between; gap: 24px; }
.result-heading span { color: var(--primary); font-size: .72rem; font-weight: 600; }
.result-heading h2 { margin: 7px 0 6px; font-family: "Barlow Condensed", MiSans, sans-serif; font-size: 2.6rem; line-height: 1; }
.result-heading p { margin: 0; color: var(--muted); font-size: .78rem; }
.result-heading > strong { color: var(--primary); font-family: "Barlow Condensed"; font-size: 3.5rem; font-weight: 600; line-height: 1; }
.nutrition-grid { margin-top: 28px; display: grid; grid-template-columns: repeat(3, 1fr) 1.5fr; gap: 10px; }
.nutrition-grid article { min-height: 140px; padding: 18px; display: flex; flex-direction: column; background: var(--canvas-soft); border-radius: 11px; }
.nutrition-grid span, .nutrition-grid small { color: var(--muted); font-size: .7rem; }
.nutrition-grid strong { margin: auto 0 5px; font-family: "Barlow Condensed"; font-size: 2.3rem; font-weight: 500; }
.ingredients p { margin: auto 0 12px; color: var(--text-secondary); font-size: .82rem; line-height: 1.55; }
.ingredients button { padding: 10px 0 0; display: flex; align-items: center; justify-content: space-between; color: var(--primary); background: transparent; border: 0; border-top: 1px solid var(--border); font-size: .78rem; font-weight: 600; }

@media (max-width: 1000px) { .scan-grid { grid-template-columns: 1fr; }.nutrition-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 620px) {
  .upload-side { min-height: auto; padding: 12px; }
  .drop-zone, .preview, .preview img { min-height: 330px; height: 330px; }
  .scan-actions { align-items: stretch; flex-direction: column; }.scan-actions > :last-child { width: 100%; }
  .result-heading { align-items: flex-start; flex-direction: column; }
  .nutrition-grid { grid-template-columns: 1fr; }
}
</style>
