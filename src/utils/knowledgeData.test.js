import { describe, expect, it } from 'vitest'
import { normalizeKnowledgeSearch, normalizeKnowledgeStats } from './knowledgeData'

describe('API 2.0 knowledge data adapters', () => {
  it('reads source details from the new metadata object', () => {
    const normalized = normalizeKnowledgeSearch({
      code: 200,
      data: {
        results: [{
          content: '营养知识',
          metadata: { source: '/tmp/nutrition.txt', file_name: 'nutrition.txt', type: 'text' },
          score: 0.95,
        }],
      },
    })

    expect(normalized.results[0]).toMatchObject({
      source: '/tmp/nutrition.txt',
      fileName: 'nutrition.txt',
      type: 'text',
    })
  })

  it('keeps API 1.0 search results compatible', () => {
    const normalized = normalizeKnowledgeSearch({ data: { results: [{ source: 'guide.pdf' }] } })
    expect(normalized.results[0].source).toBe('guide.pdf')
    expect(normalized.results[0].fileName).toBe('guide.pdf')
  })

  it('derives document count from API 2.0 sources', () => {
    const normalized = normalizeKnowledgeStats({
      data: { total_chunks: 7, sources: [{ source: '/tmp/a.txt' }, { source: '/tmp/b.png' }] },
    })
    expect(normalized.total_documents).toBe(2)
    expect(normalized.total_chunks).toBe(7)
  })

  it('keeps the API 1.0 document count when present', () => {
    const normalized = normalizeKnowledgeStats({ data: { total_documents: 10, total_chunks: 100 } })
    expect(normalized.total_documents).toBe(10)
    expect(normalized.total_chunks).toBe(100)
  })
})
