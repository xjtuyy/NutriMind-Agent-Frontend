import request from '@/utils/request'

export const getDashboardOverviewApi = () => request.get('/dashboard/overview')
export const getDetectionStatsApi = () => request.get('/dashboard/detection')
export const getTrainingStatsApi = () => request.get('/dashboard/training')
export const getUserStatsApi = () => request.get('/dashboard/users')
export const getDashboardStatsApi = (config = {}) => request.get('/dashboard/stats', config)
export const getDetectionStatusDistributionApi = () => request.get('/dashboard/detection/status-distribution')
export const getTrainingStatusDistributionApi = () => request.get('/dashboard/training/status-distribution')
