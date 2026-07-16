import { describe, expect, it } from 'vitest'
import { normalizeDetectionResult, normalizeDetectionScenes } from './detectionTaskData'

describe('Detection task API data adapter', () => {
  it('normalizes a wrapped detection response and valid boxes', () => {
    const result = normalizeDetectionResult({
      data: {
        task_uuid: 'detect-1',
        detections: [{ class_name: 'rice', confidence: 0.96, bbox: [20, 80, 300, 400] }],
        inference_time: 0.32,
      },
    })

    expect(result.taskUuid).toBe('detect-1')
    expect(result.totalObjects).toBe(1)
    expect(result.inferenceTime).toBe(0.32)
    expect(result.detections[0]).toMatchObject({
      className: 'rice', confidence: 0.96, bbox: [20, 80, 300, 400], lowConfidence: false,
    })
  })

  it('keeps an invalid box out of the overlay while retaining the result row', () => {
    const result = normalizeDetectionResult({ detections: [{ class_name: 'unknown', bbox: [1, 'bad'] }] })
    expect(result.detections[0].bbox).toBeNull()
  })

  it('accepts common scene-list response shapes', () => {
    expect(normalizeDetectionScenes({ data: { scenes: [{ scene_id: 8, name: 'food' }] } })).toEqual([
      { id: 8, name: 'food', description: '' },
    ])
  })
})
