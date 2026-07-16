import request from '@/utils/request'

export const getDashboardOverviewApi = () => request.get('/dashboard/overview')
export const getDetectionStatsApi = (config = {}) => request.get('/dashboard/detection', config)
export const getTrainingStatsApi = () => request.get('/dashboard/training')
export const getUserStatsApi = () => request.get('/dashboard/users')
export const getDashboardStatsApi = (config = {}) => request.get('/dashboard/stats', config)
export const getDetectionStatusDistributionApi = (config = {}) => request.get('/dashboard/detection/status-distribution', config)
export const getTrainingStatusDistributionApi = () => request.get('/dashboard/training/status-distribution')
