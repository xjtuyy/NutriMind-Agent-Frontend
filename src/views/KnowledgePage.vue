<template>
  <div class="knowledge-page page-shell">
    <header class="hero">
      <div>
        <span class="eyebrow"><BookOpenText :size="16" weight="bold" /> FUEL LIBRARY</span>
        <h1 class="page-title">把营养知识，<br><em>变成行动。</em></h1>
        <p class="page-description">检索可信资料中的饮食建议，用它校准下一餐、下一次训练和你的减脂计划。</p>
      </div>
      <button class="refresh-button" :disabled="statsLoading" aria-label="刷新知识库统计" @click="loadStats">
        <ArrowsClockwise :size="18" :class="{ spinning: statsLoading }" aria-hidden="true" />
        刷新
      </button>
    </header>

    <section class="search-command surface" aria-labelledby="search-title">
      <div class="command-index">01</div>
      <div class="command-content">
        <div class="command-heading">
          <div>
            <span>ASK THE LIBRARY</span>
            <h2 id="search-title" class="section-title">你想解决什么营养问题？</h2>
          </div>
          <label class="result-limit">
            <span>返回数量</span>
            <select v-model.number="limit" aria-label="检索结果数量">
              <option v-for="number in [3, 5, 10]" :key="number" :value="number">{{ number }} 条</option>
            </select>
          </label>
        </div>
        <div class="query-box">
          <MagnifyingGlass :size="22" aria-hidden="true" />
          <textarea
            v-model="query"
            rows="2"
            maxlength="200"
            placeholder="例如：减脂期力量训练后，蛋白质和碳水应该怎么搭配？"
            aria-label="营养知识检索问题"
            @keydown.ctrl.enter="search"
          />
          <FuelButton class="search-action" :loading="searching" :disabled="!query.trim()" @click="search">
            开始检索
          </FuelButton>
        </div>
        <div class="quick-queries" aria-label="快捷问题">
          <span>快速开始</span>
          <button v-for="item in quickQueries" :key="item" @click="useQuickQuery(item)">{{ item }}</button>
          <small>Ctrl + Enter 提交</small>
        </div>
      </div>
    </section>

    <section class="stats-grid" aria-label="知识库概览">
      <SpotlightCard class="stat-card" spotlight-color="rgba(159, 226, 75, .13)">
        <Files :size="24" weight="duotone" aria-hidden="true" />
        <div><strong class="metric-number"><CountUp :to="stats.total_documents" /></strong><span>份可信资料</span></div>
        <small>已完成解析</small>
      </SpotlightCard>
      <SpotlightCard class="stat-card" spotlight-color="rgba(242, 117, 63, .12)">
        <Stack :size="24" weight="duotone" aria-hidden="true" />
        <div><strong class="metric-number"><CountUp :to="stats.total_chunks" /></strong><span>个知识片段</span></div>
        <small>可用于语义检索</small>
      </SpotlightCard>
      <div class="stat-card formats surface">
        <FileText :size="24" weight="duotone" aria-hidden="true" />
        <div><strong class="metric-number">04</strong><span>种文件格式</span></div>
        <small>PDF · MD · TXT · TEXT</small>
      </div>
    </section>

    <section class="workspace-grid">
      <div class="results-panel surface" aria-live="polite">
        <div class="panel-heading">
          <div>
            <span class="panel-kicker">SEARCH OUTPUT</span>
            <h2 class="section-title">检索结果</h2>
          </div>
          <span v-if="hasSearched" class="status-chip">{{ results.length }} 条匹配</span>
        </div>

        <div v-if="searching" class="loading-results" aria-label="正在检索">
          <div v-for="number in 3" :key="number" class="result-skeleton"><i /><i /><i /></div>
        </div>
        <div v-else-if="!results.length" class="empty-state">
          <MagnifyingGlass :size="42" weight="thin" aria-hidden="true" />
          <h3>{{ hasSearched ? '暂时没有匹配结果' : '等待你的第一个问题' }}</h3>
          <p>{{ hasSearched ? '换一种更具体的描述，或先上传相关营养资料。' : '搜索膳食、营养素、热量控制或运动补给建议。' }}</p>
        </div>
        <div v-else class="results-list">
          <article v-for="(item, index) in results" :key="`${item.source}-${index}`" class="result-item">
            <header>
              <span class="result-rank">{{ String(index + 1).padStart(2, '0') }}</span>
              <div class="source-name"><FileText :size="17" />{{ item.source || '未知来源' }}</div>
              <div class="relevance" :aria-label="`相关度 ${formatScore(item.score)}`">
                <span><i :style="{ width: formatScore(item.score) }" /></span>
                {{ formatScore(item.score) }}
              </div>
              <button v-if="item.source" class="delete-button" :aria-label="`删除来源 ${item.source}`" @click="remove(item.source)">
                <Trash :size="17" />
              </button>
            </header>
            <p>{{ item.content }}</p>
          </article>
        </div>
      </div>

      <aside class="upload-panel surface" aria-labelledby="upload-title">
        <div class="panel-heading">
          <div>
            <span class="panel-kicker">BUILD YOUR SOURCE</span>
            <h2 id="upload-title" class="section-title">添加可信资料</h2>
          </div>
          <span class="command-index small">02</span>
        </div>
        <p>上传膳食指南、课程资料或论文笔记，系统会把内容拆成可检索片段。</p>
        <el-upload
          ref="uploadRef"
          drag
          :auto-upload="false"
          :limit="1"
          :accept="accept"
          :on-change="onFileChange"
          :on-remove="onFileRemove"
          :on-exceed="onFileExceed"
        >
          <div class="drop-visual"><UploadSimple :size="29" weight="bold" /></div>
          <b>拖入文件，或点击选择</b>
          <span>PDF、Markdown 或纯文本</span>
        </el-upload>
        <div class="privacy-note"><ShieldCheck :size="17" /><span>请仅上传你信任且有权使用的资料。</span></div>
        <FuelButton class="upload-action" :loading="uploading" :disabled="!selectedFile" @click="upload">
          {{ selectedFile ? '解析这份资料' : '等待选择文件' }}
        </FuelButton>
      </aside>
    </section>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  PhArrowsClockwise as ArrowsClockwise, PhBookOpenText as BookOpenText,
  PhFiles as Files, PhFileText as FileText, PhMagnifyingGlass as MagnifyingGlass,
  PhShieldCheck as ShieldCheck, PhStack as Stack, PhTrash as Trash,
  PhUploadSimple as UploadSimple,
} from '@phosphor-icons/vue'
import CountUp from '@/components/motion/CountUp.vue'
import SpotlightCard from '@/components/motion/SpotlightCard.vue'
import FuelButton from '@/components/ui/FuelButton.vue'
import { deleteDocumentApi, getKnowledgeStatsApi, searchKnowledgeApi, uploadDocumentApi } from '@/api/knowledge'
import { useUserStore } from '@/stores/user'

const accept = '.pdf,.md,.txt,.text'
const quickQueries = ['减脂期怎么吃', '训练后补给', '膳食纤维摄入']
const uploadRef = ref()
const selectedFile = ref(null)
const uploading = ref(false)
const searching = ref(false)
const statsLoading = ref(false)
const query = ref('')
const limit = ref(5)
const results = ref([])
const hasSearched = ref(false)
const stats = reactive({ total_documents: 0, total_chunks: 0 })
const userStore = useUserStore()
const demoResults = [
  { source: '中国居民膳食指南（演示）.pdf', score: 0.94, content: '成年人应保持食物多样，合理搭配谷薯类、蔬菜水果、动物性食物以及奶豆坚果类食物，并结合自身活动水平控制总能量摄入。' },
  { source: '运动营养基础（演示）.md', score: 0.88, content: '处于减脂阶段时，应优先保证蛋白质摄入和力量训练，并设置适度、可持续的热量缺口，避免过度节食影响训练表现。' },
  { source: '常见食物营养数据（演示）.txt', score: 0.82, content: '鸡胸肉是常见的优质蛋白质来源。实际热量会受到食材重量、烹饪方式和调味用量影响，图片识别结果应作为估算参考。' },
]

function payloadData(payload) { return payload?.data ?? payload }

async function loadStats() {
  if (userStore.isDemo) {
    stats.total_documents = 12
    stats.total_chunks = 286
    return
  }
  statsLoading.value = true
  try {
    const data = payloadData(await getKnowledgeStatsApi())
    stats.total_documents = data?.total_documents || 0
    stats.total_chunks = data?.total_chunks || 0
  } finally {
    statsLoading.value = false
  }
}

function onFileChange(file) { selectedFile.value = file.raw }
function onFileRemove() { selectedFile.value = null }
function onFileExceed() { ElMessage.warning('每次只能上传一个文件，请先移除当前文件') }

async function upload() {
  if (!selectedFile.value) return
  uploading.value = true
  try {
    if (userStore.isDemo) {
      ElMessage.success('预览模式：已模拟完成文档解析')
    } else {
      const data = payloadData(await uploadDocumentApi(selectedFile.value))
      ElMessage.success(`上传成功，生成 ${data?.chunks_count ?? 0} 个知识片段`)
      await loadStats()
    }
    selectedFile.value = null
    uploadRef.value?.clearFiles()
  } finally {
    uploading.value = false
  }
}

function useQuickQuery(value) {
  query.value = value
  search()
}

async function search() {
  if (!query.value.trim()) {
    ElMessage.warning('请输入搜索内容')
    return
  }
  searching.value = true
  hasSearched.value = true
  const submittedQuery = query.value.trim()
  try {
    if (userStore.isDemo) {
      await new Promise((resolve) => setTimeout(resolve, 520))
      results.value = demoResults.slice(0, limit.value)
      return
    }
    const data = payloadData(await searchKnowledgeApi({ query: submittedQuery, k: limit.value }))
    results.value = data?.results || []
  } finally {
    searching.value = false
  }
}

async function remove(source) {
  try {
    await ElMessageBox.confirm(`删除后将无法检索“${source}”中的内容，是否继续？`, '确认删除知识来源', {
      type: 'warning', confirmButtonText: '确认删除', cancelButtonText: '取消',
    })
    if (!userStore.isDemo) await deleteDocumentApi(source)
    results.value = results.value.filter((item) => item.source !== source)
    ElMessage.success(userStore.isDemo ? '预览模式：已模拟删除知识来源' : '知识来源已删除')
    await loadStats()
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') throw error
  }
}

function formatScore(score) {
  const number = Number(score)
  if (!Number.isFinite(number)) return '--'
  return `${Math.round(Math.min(Math.max(number, 0), 1) * 100)}%`
}

onMounted(loadStats)
</script>

<style lang="scss" scoped>
.knowledge-page { display: grid; gap: 22px; }
.hero { min-height: 220px; padding: clamp(24px, 4vw, 54px) clamp(20px, 4vw, 58px); display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; overflow: hidden; background: linear-gradient(112deg, rgba(26, 32, 27, .98), rgba(17, 21, 18, .88)), radial-gradient(circle at 78% 10%, rgba(159, 226, 75, .18), transparent 38%); border: 1px solid var(--border); border-radius: var(--radius-lg); }
.hero em { color: var(--primary); font-style: normal; }
.eyebrow, .panel-kicker { color: var(--primary); font-size: .74rem; font-weight: 700; letter-spacing: .13em; }
.eyebrow { margin-bottom: 17px; display: flex; align-items: center; gap: 8px; }
.refresh-button { min-height: 42px; padding: 0 14px; display: inline-flex; align-items: center; gap: 8px; color: var(--text-secondary); background: rgba(255,255,255,.035); border: 1px solid var(--border); border-radius: 10px; }
.refresh-button:hover { color: var(--primary); border-color: rgba(159,226,75,.35); }
.spinning { animation: spin .8s linear infinite; }
.search-command { padding: 22px; display: grid; grid-template-columns: 58px 1fr; gap: 20px; }
.command-index { color: var(--primary); font-family: "Barlow Condensed"; font-size: 2rem; font-weight: 600; }
.command-index.small { font-size: 1.25rem; }
.command-content { min-width: 0; }
.command-heading { margin-bottom: 18px; display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; }
.command-heading > div > span { display: block; margin-bottom: 4px; color: var(--muted); font-size: .68rem; font-weight: 600; letter-spacing: .13em; }
.result-limit { display: flex; align-items: center; gap: 9px; color: var(--muted); font-size: .72rem; }
.result-limit select { height: 36px; padding: 0 28px 0 10px; color: var(--text); background: var(--canvas-soft); border: 1px solid var(--border); border-radius: 8px; }
.query-box { min-height: 90px; padding: 13px 13px 13px 17px; display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 13px; background: var(--canvas-soft); border: 1px solid var(--border-strong); border-radius: 14px; transition: border-color 180ms var(--ease-out), box-shadow 180ms var(--ease-out); }
.query-box:focus-within { border-color: rgba(159,226,75,.65); box-shadow: 0 0 0 3px rgba(159,226,75,.08); }
.query-box > svg { color: var(--primary); }
.query-box textarea { width: 100%; min-height: 58px; padding: 7px 0; resize: none; color: var(--text); background: transparent; border: 0; outline: 0; line-height: 1.55; }
.query-box textarea::placeholder { color: #747e75; }
.search-action { min-width: 132px; }
.quick-queries { margin-top: 13px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.quick-queries > span { color: var(--muted); font-size: .72rem; }
.quick-queries button { min-height: 32px; padding: 0 10px; color: var(--text-secondary); background: transparent; border: 1px solid var(--border); border-radius: 7px; font-size: .72rem; }
.quick-queries button:hover { color: var(--primary); border-color: rgba(159,226,75,.32); }
.quick-queries small { margin-left: auto; color: var(--muted); }
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.stat-card { min-height: 126px; padding: 20px; display: grid; grid-template-columns: auto 1fr; align-content: center; column-gap: 15px; }
.stat-card > svg { color: var(--primary); }
.stat-card:nth-child(2) > svg { color: var(--accent); }
.stat-card div { display: flex; align-items: baseline; gap: 9px; }
.stat-card strong { font-size: 2rem; line-height: 1; }
.stat-card div span { color: var(--text-secondary); font-size: .82rem; }
.stat-card small { grid-column: 2; margin-top: 7px; color: var(--muted); }
.workspace-grid { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(300px, .65fr); gap: 16px; align-items: start; }
.results-panel, .upload-panel { padding: clamp(18px, 2.5vw, 28px); }
.panel-heading { margin-bottom: 22px; padding-bottom: 18px; display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; border-bottom: 1px solid var(--border); }
.panel-kicker { display: block; margin-bottom: 5px; color: var(--muted); font-size: .65rem; }
.empty-state { min-height: 300px; display: grid; place-items: center; align-content: center; text-align: center; }
.empty-state svg { margin-bottom: 14px; color: var(--muted); }
.empty-state h3 { margin: 0 0 7px; font-size: 1rem; }
.empty-state p { max-width: 38ch; margin: 0; color: var(--muted); font-size: .84rem; }
.loading-results, .results-list { display: grid; gap: 11px; }
.result-skeleton, .result-item { padding: 18px; background: rgba(255,255,255,.022); border: 1px solid var(--border); border-radius: 12px; }
.result-skeleton { display: grid; gap: 10px; }
.result-skeleton i { height: 10px; background: linear-gradient(90deg, var(--surface-soft), rgba(255,255,255,.07), var(--surface-soft)); background-size: 200% 100%; border-radius: 6px; animation: shimmer 1.2s infinite linear; }
.result-skeleton i:nth-child(1) { width: 38%; }.result-skeleton i:nth-child(3) { width: 72%; }
.result-item { transition: transform 180ms var(--ease-out), border-color 180ms var(--ease-out); }
.result-item:hover { border-color: var(--border-strong); transform: translateY(-2px); }
.result-item header { display: flex; align-items: center; gap: 10px; }
.result-rank { color: var(--primary); font-family: "Barlow Condensed"; font-size: 1.1rem; font-weight: 600; }
.source-name { min-width: 0; display: flex; align-items: center; gap: 7px; overflow: hidden; color: var(--text-secondary); font-size: .8rem; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
.relevance { margin-left: auto; display: flex; align-items: center; gap: 7px; color: var(--muted); font-size: .72rem; }
.relevance > span { width: 44px; height: 4px; overflow: hidden; background: var(--surface-soft); border-radius: 4px; }
.relevance i { height: 100%; display: block; background: var(--primary); border-radius: inherit; }
.delete-button { width: 34px; height: 34px; display: grid; place-items: center; color: var(--muted); background: transparent; border: 0; border-radius: 7px; }
.delete-button:hover { color: var(--danger); background: rgba(240,103,95,.1); }
.result-item p { margin: 14px 0 0; padding-top: 14px; color: var(--text-secondary); border-top: 1px solid var(--border); font-size: .88rem; line-height: 1.75; white-space: pre-wrap; }
.upload-panel { position: sticky; top: 18px; }
.upload-panel > p { margin: -7px 0 18px; color: var(--text-secondary); font-size: .84rem; line-height: 1.65; }
.upload-panel :deep(.el-upload) { width: 100%; }
.upload-panel :deep(.el-upload-dragger) { width: 100%; min-height: 210px; padding: 28px 18px; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px dashed var(--border-strong); border-radius: 13px; }
.upload-panel :deep(.el-upload-dragger:hover) { border-color: var(--primary); }
.drop-visual { width: 54px; height: 54px; margin-bottom: 15px; display: grid; place-items: center; color: #12170f; background: var(--primary); border-radius: 14px; transform: rotate(-4deg); }
.upload-panel :deep(.el-upload-dragger b) { color: var(--text); font-size: .86rem; }
.upload-panel :deep(.el-upload-dragger > span) { margin-top: 5px; color: var(--muted); font-size: .74rem; }
.privacy-note { margin: 13px 0; display: flex; align-items: center; gap: 8px; color: var(--muted); font-size: .72rem; }
.privacy-note svg { color: var(--primary); flex: 0 0 auto; }
.upload-action { width: 100%; }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes shimmer { to { background-position: -200% 0; } }
@media (max-width: 1050px) {
  .workspace-grid { grid-template-columns: 1fr; }
  .upload-panel { position: static; }
}
@media (max-width: 760px) {
  .hero { min-height: 190px; align-items: flex-start; }
  .refresh-button { padding: 0; width: 42px; justify-content: center; }
  .refresh-button:not(:focus) { font-size: 0; }
  .search-command { grid-template-columns: 1fr; }
  .command-index { display: none; }
  .query-box { grid-template-columns: auto 1fr; }
  .search-action { grid-column: 1 / -1; width: 100%; }
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .formats { display: none; }
  .quick-queries small { display: none; }
}
@media (max-width: 520px) {
  .hero { padding: 26px 20px; }
  .command-heading { align-items: flex-start; }
  .result-limit { flex-direction: column; align-items: flex-end; gap: 4px; }
  .stats-grid { grid-template-columns: 1fr; }
  .formats { display: grid; }
  .result-item header { flex-wrap: wrap; }
  .source-name { flex: 1; }
  .relevance { order: 3; margin-left: 32px; }
  .delete-button { margin-left: auto; }
}
</style>
