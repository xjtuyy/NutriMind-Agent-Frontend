<template>
  <div class="page-head">
    <div><h1 class="page-title">知识库</h1><p class="page-description">上传资料并通过语义检索快速找到相关内容</p></div>
    <div class="stats"><span><b>{{ stats.total_documents }}</b>文档</span><span><b>{{ stats.total_chunks }}</b>知识片段</span></div>
  </div>

  <div class="grid">
    <section class="panel upload-panel">
      <div class="section-title"><div class="icon"><el-icon><UploadFilled /></el-icon></div><div><h2>上传资料</h2><p>支持 PDF、Markdown 和纯文本</p></div></div>
      <el-upload drag :auto-upload="false" :limit="1" :accept="accept" :on-change="onFileChange" :on-remove="onFileRemove">
        <el-icon class="upload-icon"><DocumentAdd /></el-icon>
        <div>将文件拖到这里，或<em>点击选择</em></div>
        <template #tip><div class="el-upload__tip">单次上传一个 .pdf、.md、.txt 或 .text 文件</div></template>
      </el-upload>
      <el-button class="primary-button" type="primary" :disabled="!selectedFile" :loading="uploading" @click="upload">上传并解析</el-button>
    </section>

    <section class="panel search-panel">
      <div class="section-title"><div class="icon"><el-icon><Search /></el-icon></div><div><h2>语义检索</h2><p>输入问题，查找语义相关的知识片段</p></div></div>
      <div class="search-row"><el-input v-model="query" size="large" clearable placeholder="例如：均衡饮食需要注意什么？" @keyup.enter="search" /><el-select v-model="limit" size="large"><el-option v-for="n in [3,5,10]" :key="n" :label="`${n} 条`" :value="n" /></el-select><el-button type="primary" size="large" :loading="searching" @click="search">搜索</el-button></div>
    </section>
  </div>

  <section class="panel results-panel">
    <div class="result-heading"><h2>检索结果</h2><span v-if="hasSearched">共 {{ results.length }} 条</span></div>
    <el-skeleton v-if="searching" :rows="4" animated />
    <el-empty v-else-if="!results.length" :description="hasSearched ? '没有找到相关内容，请换个关键词试试' : '输入关键词开始检索'" />
    <div v-else class="results">
      <article v-for="(item, index) in results" :key="`${item.source}-${index}`">
        <div class="meta"><span class="rank">{{ index + 1 }}</span><el-tag effect="plain">{{ item.source || '未知来源' }}</el-tag><span class="score">相关度 {{ formatScore(item.score) }}</span><el-button v-if="item.source" text type="danger" @click="remove(item.source)">删除来源</el-button></div>
        <p>{{ item.content }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { DocumentAdd, Search, UploadFilled } from '@element-plus/icons-vue'
import { deleteDocumentApi, getKnowledgeStatsApi, searchKnowledgeApi, uploadDocumentApi } from '@/api/knowledge'

const accept = '.pdf,.md,.txt,.text'
const selectedFile = ref(null), uploading = ref(false), searching = ref(false)
const query = ref(''), limit = ref(5), results = ref([]), hasSearched = ref(false)
const stats = reactive({ total_documents: 0, total_chunks: 0 })

function payloadData(payload) { return payload?.data ?? payload }
async function loadStats() {
  const data = payloadData(await getKnowledgeStatsApi())
  stats.total_documents = data?.total_documents || 0
  stats.total_chunks = data?.total_chunks || 0
}
function onFileChange(file) { selectedFile.value = file.raw }
function onFileRemove() { selectedFile.value = null }
async function upload() {
  if (!selectedFile.value) return
  uploading.value = true
  try {
    const data = payloadData(await uploadDocumentApi(selectedFile.value))
    ElMessage.success(`上传成功，生成 ${data?.chunks_count ?? 0} 个知识片段`)
    selectedFile.value = null
    await loadStats()
  } finally { uploading.value = false }
}
async function search() {
  if (!query.value.trim()) { ElMessage.warning('请输入搜索内容'); return }
  searching.value = true; hasSearched.value = true
  try { const data = payloadData(await searchKnowledgeApi({ query: query.value.trim(), k: limit.value })); results.value = data?.results || [] } finally { searching.value = false }
}
async function remove(source) {
  await ElMessageBox.confirm(`确定删除“${source}”及其全部知识片段吗？`, '删除文档', { type: 'warning' })
  await deleteDocumentApi(source)
  ElMessage.success('文档已删除')
  results.value = results.value.filter((item) => item.source !== source)
  await loadStats()
}
function formatScore(score) { return Number.isFinite(Number(score)) ? `${Math.round(Number(score) * 100)}%` : '--' }
onMounted(() => loadStats())
</script>

<style lang="scss" scoped>
.page-head { display:flex; align-items:center; justify-content:space-between; gap:20px; margin-bottom:24px; }.stats { display:flex; gap:12px; }.stats span { min-width:110px; padding:13px 18px; display:flex; align-items:baseline; gap:7px; background:#e7f1ed; border-radius:12px; color:$muted; }.stats b { font-size:24px; color:$primary-dark; }.grid { display:grid; grid-template-columns:1fr 1.35fr; gap:20px; margin-bottom:20px; }.section-title { display:flex; gap:13px; align-items:center; margin-bottom:22px; }.section-title .icon { width:42px; height:42px; display:grid; place-items:center; color:$primary; background:#e6f2ed; border-radius:12px; font-size:20px; }.section-title h2,.result-heading h2 { margin:0; font-size:18px; }.section-title p { margin:5px 0 0; color:$muted; font-size:13px; }.upload-icon { font-size:42px; color:$primary; }.el-upload em { color:$primary; font-style:normal; }.primary-button { width:100%; margin-top:18px; background:$primary; border-color:$primary; }.search-row { display:grid; grid-template-columns:1fr 95px 88px; gap:10px; }.search-row .el-button { background:$primary; border-color:$primary; }.result-heading { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }.result-heading span { color:$muted; }.results { display:grid; gap:13px; }.results article { padding:18px; border:1px solid $border; border-radius:12px; background:#fbfdfc; }.meta { display:flex; align-items:center; gap:10px; }.rank { width:25px; height:25px; display:grid; place-items:center; border-radius:50%; background:$primary; color:white; font-size:12px; }.score { margin-left:auto; color:$muted; font-size:12px; }.results p { margin:14px 0 0; line-height:1.75; white-space:pre-wrap; } @media(max-width:950px){.grid{grid-template-columns:1fr}.page-head{align-items:flex-start;flex-direction:column}} @media(max-width:600px){.stats{width:100%}.stats span{min-width:0;flex:1;padding:10px}.search-row{grid-template-columns:1fr 85px}.search-row .el-button{grid-column:1/-1}.meta{flex-wrap:wrap}.score{margin-left:0}}
</style>
