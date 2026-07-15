export function unwrapApiData(payload) {
  return payload?.data ?? payload
}

export function normalizeKnowledgeResult(item = {}) {
  const metadata = item.metadata && typeof item.metadata === 'object' ? item.metadata : {}
  const source = metadata.source || item.source || ''

  return {
    ...item,
    metadata,
    source,
    fileName: metadata.file_name || item.fileName || source,
    type: metadata.type || item.type || '',
  }
}

export function normalizeKnowledgeSearch(payload) {
  const data = unwrapApiData(payload) || {}
  const results = Array.isArray(data.results) ? data.results.map(normalizeKnowledgeResult) : []
  return { ...data, results }
}

export function normalizeKnowledgeStats(payload) {
  const data = unwrapApiData(payload) || {}
  const sources = Array.isArray(data.sources) ? data.sources : []
  const legacyTotal = Number(data.total_documents)
  const chunks = Number(data.total_chunks)

  return {
    ...data,
    sources,
    total_documents: Number.isFinite(legacyTotal) ? legacyTotal : sources.length,
    total_chunks: Number.isFinite(chunks) ? chunks : 0,
  }
}
