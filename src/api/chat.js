import request from '@/utils/request'

const TEXT_CHAT_TIMEOUT = 120000
const IMAGE_CHAT_TIMEOUT = 180000

export function sendChatMessageApi({ sessionId, message, detections } = {}, config = {}) {
  const data = {
    session_id: sessionId,
    message,
  }
  if (Array.isArray(detections) && detections.length) data.detections = detections
  return request.post('/chat/message', data, {
    timeout: TEXT_CHAT_TIMEOUT,
    silent: true,
    ...config,
  })
}

export function sendChatImageApi(file, { sessionId, message } = {}, config = {}) {
  const data = new FormData()
  data.append('file', file)
  data.append('message', message)
  if (sessionId) data.append('session_id', sessionId)
  return request.post('/chat/image', data, {
    timeout: IMAGE_CHAT_TIMEOUT,
    silent: true,
    ...config,
  })
}
