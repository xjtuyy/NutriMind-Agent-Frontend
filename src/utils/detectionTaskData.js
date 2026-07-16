function unwrapApiData(payload) {
  return payload?.data ?? payload
}

function numberOrNull(value) {
  if (value === null || value === undefined || value === '') return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function normalizeBox(value) {
  if (!Array.isArray(value) || value.length < 4) return null
  const box = value.slice(0, 4).map(numberOrNull)
  return box.every((coordinate) => coordinate !== null) ? box : null
}

export function normalizeDetectionResult(payload) {
  const data = unwrapApiData(payload) || {}
  const detections = (Array.isArray(data.detections) ? data.detections : []).map((item, index) => {
    const confidence = numberOrNull(item?.confidence)
    return {
      id: `${item?.class_name || 'object'}-${index}`,
      className: typeof item?.class_name === 'string' ? item.class_name : 'unknown',
      classNameCn: typeof item?.class_name_cn === 'string' ? item.class_name_cn : '',
      confidence,
      bbox: normalizeBox(item?.bbox),
      lowConfidence: typeof item?.low_confidence === 'boolean'
        ? item.low_confidence
        : confidence !== null && confidence < 0.25,
    }
  })

  const totalObjects = numberOrNull(data.total_objects)
  return {
    taskUuid: data.task_uuid ?? data.uuid ?? null,
    detections,
    totalObjects: totalObjects !== null ? totalObjects : detections.length,
    inferenceTime: numberOrNull(data.inference_time),
  }
}

export function normalizeDetectionScenes(payload) {
  const data = unwrapApiData(payload)
  const items = Array.isArray(data) ? data : data?.items || data?.scenes || []
  if (!Array.isArray(items)) return []
  return items.map((item, index) => ({
    id: item?.id ?? item?.scene_id ?? index + 1,
    name: item?.name_cn || item?.display_name || item?.name || `场景 ${index + 1}`,
    description: item?.description || '',
  }))
}
