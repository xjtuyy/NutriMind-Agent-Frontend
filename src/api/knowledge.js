import request from '@/utils/request'

export function uploadDocumentApi(file) {
  const data = new FormData()
  data.append('file', file)
  return request.post('/knowledge/upload', data)
}

export const searchKnowledgeApi = (params) => request.get('/knowledge/search', { params })
export const deleteDocumentApi = (source) => request.delete('/knowledge/', { params: { source } })
export const getKnowledgeStatsApi = () => request.get('/knowledge/stats')
