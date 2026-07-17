import request from '@/utils/request'

export const registerApi = (data) => request.post('/auth/register', data)
export const loginApi = (data) => request.post('/auth/login', data)
export const getCurrentUserApi = (config = {}) => request.get('/auth/me', config)
export const changePasswordApi = (data) => request.post('/auth/change-password', data)
export const logoutApi = () => request.post('/auth/logout')
