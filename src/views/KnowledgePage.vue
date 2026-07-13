<template>
  <div class="page-head">
    <div><span class="eyebrow">NUTRITION KNOWLEDGE</span><h1 class="page-title">营养知识库</h1><p class="page-description">沉淀可信的饮食与营养资料，为食物分析和健康建议提供专业依据。</p></div>
    <el-button :icon="Refresh" :loading="statsLoading" @click="loadStats">刷新数据</el-button>
  </div>

  <section class="overview" aria-label="知识库概览">
    <article class="metric-card"><span class="metric-icon"><el-icon><Files /></el-icon></span><div><small>营养资料</small><strong>{{ stats.total_documents }}</strong><p>已完成解析的专业文档</p></div></article>
    <article class="metric-card"><span class="metric-icon chunks"><el-icon><Grid /></el-icon></span><div><small>知识片段</small><strong>{{ stats.total_chunks }}</strong><p>可支持营养分析的内容片段</p></div></article>
    <article class="metric-card"><span class="metric-icon formats"><el-icon><Document /></el-icon></span><div><small>支持格式</small><strong>4</strong><p>PDF、MD、TXT 与 TEXT</p></div></article>
  </section>

  <div class="grid">
    <section class="panel upload-panel">
      <div class="section-heading"><div><span class="step">01</span><h2>添加营养资料</h2></div><p>上传膳食指南、营养研究等可信资料，系统将自动解析内容。</p></div>
      <el-upload ref="uploadRef" drag :auto-upload="false" :limit="1" :accept="accept" :on-change="onFileChange" :on-remove="onFileRemove" :on-exceed="onFileExceed">
        <el-icon class="upload-icon"><DocumentAdd /></el-icon>
        <div class="upload-copy"><b>拖拽文件到此处上传</b><span>或点击浏览本地文件</span></div>
        <template #tip><div class="el-upload__tip"><span>支持 .pdf、.md、.txt、.text</span><span>单次上传 1 个文件</span></div></template>
      </el-upload>
      <el-button class="primary-button" type="primary" :disabled="!selectedFile" :loading="uploading" @click="upload">{{ uploading ? '正在解析文档' : '上传并开始解析' }}</el-button>
    </section>

    <section class="panel search-panel">
      <div class="section-heading"><div><span class="step">02</span><h2>查询营养知识</h2></div><p>直接描述你的营养问题，系统将按语义相关度查找专业资料。</p></div>
      <label class="field-label" for="knowledge-query">你想了解什么？</label>
      <el-input id="knowledge-query" v-model="query" type="textarea" :rows="4" resize="none" maxlength="200" show-word-limit placeholder="例如：成年人每日膳食纤维的建议摄入量是多少？" @keydown.ctrl.enter="search" />
      <div class="search-options"><label>返回结果数量</label><el-select v-model="limit"><el-option v-for="n in [3,5,10]" :key="n" :label="`${n} 条结果`" :value="n" /></el-select><span>Ctrl + Enter 快速检索</span></div>
      <el-button class="search-button" type="primary" :icon="Search" :loading="searching" @click="search">开始语义检索</el-button>
    </section>
  </div>

  <section class="panel results-panel">
    <div class="result-heading"><div><h2>检索结果</h2><p>{{ hasSearched ? `“${lastQuery}” 的相关知识` : '检索结果将在这里展示' }}</p></div><el-tag v-if="hasSearched" type="info" effect="plain">{{ results.length }} 条结果</el-tag></div>
    <el-skeleton v-if="searching" :rows="4" animated />
    <el-empty v-else-if="!results.length" :image-size="90" :description="hasSearched ? '没有找到相关内容，请尝试更换检索描述' : '完成上方检索后，相关知识片段会展示在这里'" />
    <div v-else class="results">
      <article v-for="(item, index) in results" :key="`${item.source}-${index}`">
        <div class="meta"><span class="rank">{{ String(index + 1).padStart(2, '0') }}</span><span class="source"><el-icon><Document /></el-icon>{{ item.source || '未知来源' }}</span><span class="score"><i :style="{ width: formatScore(item.score) }"></i>相关度 {{ formatScore(item.score) }}</span><el-button v-if="item.source" text type="danger" @click="remove(item.source)">删除来源</el-button></div>
        <p>{{ item.content }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document, DocumentAdd, Files, Grid, Refresh, Search } from '@element-plus/icons-vue'
import { deleteDocumentApi, getKnowledgeStatsApi, searchKnowledgeApi, uploadDocumentApi } from '@/api/knowledge'

const accept = '.pdf,.md,.txt,.text'
const uploadRef = ref(), selectedFile = ref(null), uploading = ref(false), searching = ref(false), statsLoading = ref(false)
const query = ref(''), lastQuery = ref(''), limit = ref(5), results = ref([]), hasSearched = ref(false)
const stats = reactive({ total_documents: 0, total_chunks: 0 })

function payloadData(payload) { return payload?.data ?? payload }
async function loadStats() {
  statsLoading.value = true
  try {
    const data = payloadData(await getKnowledgeStatsApi())
    stats.total_documents = data?.total_documents || 0
    stats.total_chunks = data?.total_chunks || 0
  } finally { statsLoading.value = false }
}
function onFileChange(file) { selectedFile.value = file.raw }
function onFileRemove() { selectedFile.value = null }
function onFileExceed() { ElMessage.warning('每次只能上传一个文件，请先移除当前文件') }
async function upload() {
  if (!selectedFile.value) return
  uploading.value = true
  try {
    const data = payloadData(await uploadDocumentApi(selectedFile.value))
    ElMessage.success(`上传成功，生成 ${data?.chunks_count ?? 0} 个知识片段`)
    selectedFile.value = null
    uploadRef.value?.clearFiles()
    await loadStats()
  } finally { uploading.value = false }
}
async function search() {
  if (!query.value.trim()) { ElMessage.warning('请输入搜索内容'); return }
  searching.value = true; hasSearched.value = true; lastQuery.value = query.value.trim()
  try { const data = payloadData(await searchKnowledgeApi({ query: lastQuery.value, k: limit.value })); results.value = data?.results || [] } finally { searching.value = false }
}
async function remove(source) {
  try {
    await ElMessageBox.confirm(`删除后将无法检索“${source}”中的任何内容，是否继续？`, '确认删除知识来源', { type: 'warning', confirmButtonText: '确认删除', cancelButtonText: '取消' })
    await deleteDocumentApi(source)
    ElMessage.success('知识来源已删除')
    results.value = results.value.filter((item) => item.source !== source)
    await loadStats()
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') throw error
  }
}
function formatScore(score) { return Number.isFinite(Number(score)) ? `${Math.round(Number(score) * 100)}%` : '--' }
onMounted(() => loadStats())
</script>

<style lang="scss" scoped>
.page-head { margin-bottom:24px; display:flex; align-items:flex-end; justify-content:space-between; gap:20px; }.eyebrow { display:block; margin-bottom:8px; color:$primary; font-size:10px; font-weight:750; letter-spacing:.14em; }.overview { margin-bottom:20px; display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }.metric-card { min-width:0; padding:20px; display:flex; align-items:center; gap:16px; background:#fff; border:1px solid $border; border-radius:$radius; box-shadow:$shadow-sm; }.metric-icon { flex:0 0 auto; width:46px; height:46px; display:grid; place-items:center; color:$primary; background:$primary-soft; border-radius:11px; font-size:20px; }.metric-icon.chunks { color:#476c9b; background:#edf3fa; }.metric-icon.formats { color:#9a6b27; background:#fbf4e8; }.metric-card div { min-width:0; display:grid; grid-template-columns:auto 1fr; align-items:baseline; column-gap:10px; }.metric-card small { color:$text-secondary; font-size:11px; font-weight:600; }.metric-card strong { grid-row:1/3; grid-column:2; justify-self:end; color:$navy; font-size:30px; font-weight:650; letter-spacing:-.04em; }.metric-card p { grid-column:1; margin:6px 0 0; overflow:hidden; color:$muted; font-size:10px; text-overflow:ellipsis; white-space:nowrap; }.grid { margin-bottom:20px; display:grid; grid-template-columns:.88fr 1.12fr; gap:20px; }.section-heading { min-height:74px; margin-bottom:20px; padding-bottom:18px; border-bottom:1px solid $border; }.section-heading > div { display:flex; align-items:center; gap:10px; }.section-heading h2,.result-heading h2 { margin:0; color:$navy; font-size:17px; font-weight:650; }.section-heading p,.result-heading p { margin:7px 0 0; color:$muted; font-size:11px; line-height:1.55; }.step { color:$primary; font-size:10px; font-weight:750; letter-spacing:.08em; }.upload-panel :deep(.el-upload-dragger) { height:190px; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#fafcfd; border:1px dashed $border-strong; border-radius:10px; transition:.2s; }.upload-panel :deep(.el-upload-dragger:hover) { background:#f6fbf9; border-color:$primary; }.upload-icon { margin-bottom:14px; color:$primary; font-size:35px; }.upload-copy { display:grid; gap:5px; }.upload-copy b { color:$text; font-size:12px; font-weight:600; }.upload-copy span { color:$muted; font-size:10px; }.el-upload__tip { display:flex; justify-content:space-between; color:$muted; font-size:10px; }.primary-button,.search-button { width:100%; height:40px; margin-top:16px; font-weight:600; }.field-label { display:block; margin:0 0 8px; color:$text-secondary; font-size:11px; font-weight:600; }.search-panel :deep(.el-textarea__inner) { padding:12px 14px; line-height:1.65; border-radius:9px; }.search-options { height:38px; margin-top:12px; display:flex; align-items:center; gap:10px; }.search-options label { color:$text-secondary; font-size:10px; }.search-options .el-select { width:120px; }.search-options > span { margin-left:auto; color:$muted; font-size:9px; }.result-heading { margin-bottom:20px; padding-bottom:16px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid $border; }.results { display:grid; gap:10px; }.results article { padding:18px; border:1px solid $border; border-radius:10px; background:#fff; transition:border-color .18s,box-shadow .18s; }.results article:hover { border-color:$border-strong; box-shadow:$shadow-sm; }.meta { display:flex; align-items:center; gap:10px; }.rank { color:$primary; font-size:10px; font-weight:750; letter-spacing:.08em; }.source { min-width:0; display:flex; align-items:center; gap:6px; overflow:hidden; color:$text-secondary; font-size:11px; font-weight:600; text-overflow:ellipsis; white-space:nowrap; }.score { margin-left:auto; display:flex; align-items:center; gap:7px; color:$muted; font-size:10px; white-space:nowrap; }.score::before { content:""; width:40px; height:3px; background:$border; border-radius:3px; }.score i { display:none; }.results p { margin:13px 0 0; padding-top:13px; color:$text-secondary; border-top:1px solid #edf1f4; font-size:12px; line-height:1.75; white-space:pre-wrap; }
@media(max-width:1100px){.grid{grid-template-columns:1fr}.overview{grid-template-columns:repeat(2,1fr)}.metric-card:last-child{display:none}} @media(max-width:650px){.page-head{align-items:flex-start;flex-direction:column}.overview{grid-template-columns:1fr 1fr}.metric-card{padding:14px;gap:10px}.metric-card p{display:none}.metric-card strong{font-size:24px}.metric-icon{width:38px;height:38px}.metric-card div{display:block}.metric-card strong{display:block;margin-top:3px}.search-options>span{display:none}.meta{flex-wrap:wrap}.score{margin-left:0}.meta .el-button{margin-left:auto}.results p{font-size:11px}}
</style>
