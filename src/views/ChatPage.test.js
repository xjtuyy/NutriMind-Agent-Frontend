// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

const chatMocks = vi.hoisted(() => ({
  sendChatImageApi: vi.fn(),
  sendChatMessageApi: vi.fn(),
}))

vi.mock('@/api/chat', () => ({
  sendChatImageApi: chatMocks.sendChatImageApi,
  sendChatMessageApi: chatMocks.sendChatMessageApi,
}))

import ChatPage from './ChatPage.vue'
import { useUserStore } from '@/stores/user'

describe('ChatPage generation controls', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    setActivePinia(createPinia())
    useUserStore().saveUser({ id: 18, username: 'zhangsan', roles: [] })
  })

  it('aborts the active request and replaces the pending reply', async () => {
    let requestSignal
    chatMocks.sendChatMessageApi.mockImplementation((_payload, config) => {
      requestSignal = config.signal
      return new Promise((_resolve, reject) => {
        requestSignal.addEventListener('abort', () => reject(Object.assign(new Error('cancelled'), { code: 'ERR_CANCELED' })), { once: true })
      })
    })

    const wrapper = mount(ChatPage)
    await wrapper.find('textarea').setValue('帮我安排训练后的晚餐')
    await wrapper.find('.send-button').trigger('click')

    expect(chatMocks.sendChatMessageApi).toHaveBeenCalledOnce()
    expect(wrapper.find('.stop-button').exists()).toBe(true)
    expect(requestSignal.aborted).toBe(false)

    await wrapper.find('.stop-button').trigger('click')
    await flushPromises()

    expect(requestSignal.aborted).toBe(true)
    expect(wrapper.text()).toContain('已停止生成')
    expect(wrapper.find('.send-button').exists()).toBe(true)
    wrapper.unmount()
  })
})
